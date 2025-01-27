// imports
import {
  getPRepTerm,
  getLastBlock,
  getBlockByHeight,
} from './json-rpc-services';
import { LastBlockDto } from '../shared/dto/json-rpc-services.dto';
import { TaskInput } from '../shared/types/GeneralTypes';
import { Logger } from '@nestjs/common';
import { getInitBlock } from './utils';
import { Seasons } from '../collections/seasons/seasons.interface';

// Amount of block from the period end block to fetch all
// the tasks related information.
// This value MUST be higher than 43200 which in theory is
// period length in blocks
const amountOfBlocksFromLatest = 100;

//TODO: REFACTOR THIS FILE
/*
 * BlockMonitorTaskRunner class to monitor the JVM chain for new blocks and transactions.
 * The class uses the JVM service to get blocks and transactions.
 * The class is designed to be run in the background.
 */
export default class BlockMonitorTaskRunner {
  private currentBlockHeight: number;
  private running: boolean;
  private timer: NodeJS.Timeout;
  private tasks: Array<(input: TaskInput) => Promise<void>>;
  private latestTerm: number;
  private amountToSleep: number;
  private bypassTasks: boolean;
  private tasksRunning: boolean;
  private logger: Logger;
  private dbSeasonGetter: () => Promise<Seasons[]>;

  /**
   * Constructor for the BlockMonitorTaskRunner class.
   */
  constructor(
    tasks = [],
    dbSeasonGetter: () => Promise<Seasons[]>,
    bypassTasks = false,
  ) {
    if (tasks == null) {
      throw new Error('Invalid argument in BlockMonitorTaskRunner constructor');
    }
    this.logger = new Logger(BlockMonitorTaskRunner.name);
    this.currentBlockHeight = null;
    this.running = false;
    this.timer = null;
    this.tasks = tasks;
    this.latestTerm = null;
    this.amountToSleep = 1000;
    this.bypassTasks = bypassTasks;
    this.tasksRunning = false;
    this.dbSeasonGetter = dbSeasonGetter;

    this.runLoop = this.runLoop.bind(this);
  }

  async start() {
    if (!this.running) {
      let currentLoop = 0;
      const maxLoops = 60;

      // the following loop waits for a max of 60 seconds
      // to allow for the required initial tasks that
      // setup the database to run completely.
      // this approach has a potential issue, if the
      // initial tasks take more than 60 seconds to
      // complete the app will crash.
      // A better implementation is to setup a way to
      // notify when the initial tasks are completed
      // directly from the task themselves.
      // currently implemeting that solution has been
      // dificult due to the separation of concerns in
      // the task producer and task consumer
      // TODO: figure out a way to implement a better
      // solution for this
      while (currentLoop < maxLoops) {
        const seasons = await this.dbSeasonGetter();
        this.currentBlockHeight = await getInitBlock(seasons);

        if (this.currentBlockHeight == null) {
          await this.sleep(1000);
        } else {
          break;
        }
        currentLoop++;
      }

      if (this.currentBlockHeight == null) {
        this.logger.log({
          level: 'error',
          message: 'Error getting block height, cannot start background loop.',
        });
        throw new Error(
          'CRITICAL: Error getting block height, cannot start background loop.',
        );
      }

      this.running = true;
      this.runLoop();
      this.logger.log({
        level: 'info',
        message: 'Background loop started.',
      });
    } else {
      this.logger.log({
        level: 'info',
        message: 'Background loop is already running.',
      });
    }
  }

  async getBlockJvm(
    label: null | number | string = null,
  ): Promise<LastBlockDto | null> {
    try {
      if (label == null || label == 'latest') {
        return await getLastBlock();
      }

      if (typeof label === 'number') {
        return await getBlockByHeight('0x' + label.toString(16));
      }

      if (Number.isNaN(parseInt(label))) {
        throw new Error('Invalid argument in getBlockJvm');
      }

      if (typeof label === 'string') {
        if (label.startsWith('0x')) {
          return await getBlockByHeight(label);
        }
        const heightInHex = parseInt(label).toString(16);
        return await getBlockByHeight(heightInHex);
      }

      throw new Error(`Invalid argument in getBlockJvm. ${label}`);
    } catch (err) {
      this.logger.log({
        level: 'error',
        message: `Error getting block on JVM chain: ${typeof err.message === 'string' ? err.message : JSON.stringify(err.message)}`,
        err: err,
      });
    }
  }

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loopInnerLogic() {
    this.amountToSleep = 1000;
    if (this.latestTerm == null) {
      this.logger.log({ level: 'info', message: 'Executing First loop' });
    }
    // On monitor start we either start from the latest block or from the value provided to this.initBlockHeight
    const height = this.currentBlockHeight;

    // fetch block data. If the block is not available, wait for 1 second and try again
    const block = await this.getBlockJvm(height);
    if (block != null) {
      this.logger.log({
        level: 'info',
        message: `Block (${height}) available.`,
      });
      const prepTerm = await getPRepTerm(height);
      const seq = parseInt(prepTerm.sequence, 16);
      this.latestTerm = seq;
      this.logger.log({
        level: 'info',
        message: `Latest term set to: ${this.latestTerm}`,
      });
      this.logger.log({
        level: 'info',
        message: `Calculating block of interest`,
      });
      const blockOfInterest =
        parseInt(prepTerm.endBlockHeight, 16) - amountOfBlocksFromLatest;

      this.logger.log({
        level: 'info',
        message: `Block of interest: ${blockOfInterest}`,
      });
      if (height === blockOfInterest) {
        this.logger.log({
          level: 'info',
          message:
            'Current block is the block of interest. Proceed with tasks.',
        });
        if (this.tasks.length > 0 && !this.bypassTasks) {
          this.tasksRunning = true;
          this.logger.log({ level: 'info', message: 'Executing tasks' });
          for (const task of this.tasks) {
            try {
              const taskInput = {
                height: height,
                prepTerm: this.latestTerm,
              };
              await task(taskInput);
            } catch (err) {
              this.logger.log({
                level: 'error',
                message: `(CRITICAL) Block monitor: Error executing task, will continue executing other tasks. ${typeof err.message === 'string' ? err.message : JSON.stringify(err.message)}`,
                error: err,
              });
            }
          }
          this.tasksRunning = false;
        } else {
          this.logger.log({ level: 'info', message: 'No tasks to execute.' });
        }
        this.logger.log({
          level: 'info',
          message:
            'Setting next block to fetch to the first block of the next term',
        });
        this.currentBlockHeight += amountOfBlocksFromLatest + 1;
      } else {
        this.logger.log({
          level: 'info',
          message: 'Setting next block to fetch to the block of interest',
        });
        this.currentBlockHeight = blockOfInterest;
      }
    } else {
      let latestBlock = null;
      try {
        latestBlock = await this.getBlockJvm();
        if (latestBlock != null && height != null) {
          this.logger.log({
            level: 'info',
            message: 'Dinamically calculating amount to sleep',
          });
          this.amountToSleep = (height - latestBlock.height) * 1000;
        }
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: `Error getting latest block, Cant dinamically calculate amount to sleep. Sleep interval set to default value of 1s. ${typeof err.message === 'string' ? err.message : JSON.stringify(err.message)}`,
          error: err,
        });
        this.amountToSleep = 1000;
      }
      this.logger.log({
        level: 'info',
        message: `Block (${height}) not available, chain currently on block ${latestBlock.height}.`,
      });
      this.logger.log({
        level: 'info',
        message: `Sleeping for ${this.amountToSleep / 1000} s`,
      });
      // Dynamic interval has been implemented so it is
      // not necessary to execute the sleep function
      // but this is left here for reference
      // await this.sleep(amountToSleep);
    }
  }

  async runLoop() {
    if (this.running) {
      try {
        // Check if the tasks from the previous loop are still running
        // If they are, dont execute the inner logic and call the runLoop function again
        // this will run until the tasks are completed
        // this way we avoid running task concurrently
        if (this.tasksRunning) {
          this.logger.log({
            level: 'info',
            message:
              'Tasks for previous loop are running, skipping execution of new loop.',
          });
          // resetting interval time
          this.amountToSleep = 1000;
        } else {
          // Perform the logic here
          await this.loopInnerLogic();
        }
      } catch (err) {
        this.logger.log({
          level: 'error',
          message: `Block monitor: Unexpected Error in loopInnerLogic. ${typeof err.message === 'string' ? err.message : JSON.stringify(err.message)}`,
          error: err,
        });
      } finally {
        this.timer = setTimeout(this.runLoop, this.amountToSleep);
      }
    }
  }

  async stop() {
    if (this.running) {
      this.running = false;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      // Perform any cleanup here if needed
      this.logger.log({ level: 'info', message: 'Background loop stopped.' });
    }
  }
}
