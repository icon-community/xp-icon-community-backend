// imports
const { getPRepTerm } = require("../../utils/json-rpc-services");
const config = require("../../utils/config");

// Amount of block from the period end block to fetch all
// the tasks related information.
// This value MUST be higher than 43200 which in theory is
// period length in blocks
const amountOfBlocksFromLatest = 100;
const lineBreaker = config.misc.lineBreak;

/*
 * Monitor class to monitor the JVM chain for new blocks and transactions.
 * The class uses the JVM service to get blocks and transactions.
 * The class is designed to be run in the background.
 */
class Monitor {
  // Constructor for the Monitor class.
  // jvmService: The JVM service to use for getting blocks and transactions.
  // initBlockHeight: The initial block height to start monitoring from.
  //                 If not provided, the monitor will start from the latest block.
  //                 If provided, the monitor will start from the provided block height.
  //
  constructor(
    jvmService,
    tasks = [],
    jvmBuilder,
    initBlockHeight = null,
    bypassTasks = false,
  ) {
    if (jvmService == null || tasks == null || jvmBuilder == null) {
      throw new Error("Invalid argument in Monitor constructor");
    }
    this.jvmService = jvmService;
    this.jvmBuilder = jvmBuilder;
    this.currentBlockHeight = initBlockHeight;
    this.running = false;
    this.timer = null;
    this.tasks = tasks;
    this.latestTerm = null;
    this.amountToSleep = 1000;
    this.bypassTasks = bypassTasks;
    this.tasksRunning = false;

    this.runLoop = this.runLoop.bind(this);
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.runLoop();
      console.log("Background loop started.");
    } else {
      console.log("Background loop is already running.");
    }
  }

  async getBlockJvm(label = null) {
    try {
      const hashStart = "0x";
      if (label == null || label == "latest") {
        return await this.jvmService.getLastBlock().execute();
      } else if (typeof label == "string" && label.startsWith(hashStart)) {
        return await this.jvmService.getBlockByHash(label).execute();
      } else {
        return await this.jvmService.getBlockByHeight(label).execute();
      }
    } catch (err) {
      console.log("\n> Block monitor: Error getting block on JVM chain:");
      console.log(err);
      // throw new Error("Error getting block on JVM chain");
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async loopInnerLogic() {
    this.amountToSleep = 1000;
    console.log(lineBreaker);
    if (this.latestTerm == null) {
      console.log("> Executing First loop");
    } else {
      console.log("> Latest term set to: ", this.latestTerm);
    }
    // On monitor start we either start from the latest block or from the value provided to this.initBlockHeight
    const height = this.currentBlockHeight;

    // fetch block data. If the block is not available, wait for 1 second and try again
    const block = await this.getBlockJvm(height);
    if (block != null) {
      console.log(`> Block (${height}) available.`);
      const prepTerm = await getPRepTerm(height);
      const seq = parseInt(prepTerm.sequence, 16);
      console.log(`> Setting latest term to: ${seq}`);
      this.latestTerm = seq;
      console.log(`> Calculating block of interest`);
      const blockOfInterest =
        parseInt(prepTerm.endBlockHeight, 16) - amountOfBlocksFromLatest;

      console.log(`> Block of interest: ${blockOfInterest}`);
      if (height === blockOfInterest) {
        console.log(
          "> Current block is the block of interest. Proceed with tasks.",
        );
        if (this.tasks.length > 0 && !this.bypassTasks) {
          this.tasksRunning = true;
          console.log("> Executing tasks:");
          for (const task of this.tasks) {
            const taskInput = {
              height: height,
              prepTerm: this.latestTerm,
            };
            await task(taskInput);
          }
          this.tasksRunning = false;
        } else {
          console.log("> No tasks to execute.");
        }
        console.log(
          "> Setting next block to fetch to the first block of the next term",
        );
        this.currentBlockHeight += amountOfBlocksFromLatest + 1;
      } else {
        console.log("> Setting next block to fetch to the block of interest");
        this.currentBlockHeight = blockOfInterest;
      }
    } else {
      let latestBlock = null;
      try {
        latestBlock = await this.getBlockJvm();
        if (latestBlock != null && height != null) {
          console.log("> Dinamically calculating amount to sleep");
          this.amountToSleep = (height - latestBlock.height) * 1000;
        }
      } catch (err) {
        console.log(err);
        console.log(
          "> Error getting latest block, Cant dinamically calculate amount to sleep. Sleep interval set to default value of 1s.",
        );
        this.amountToSleep = 1000;
      }
      console.log(
        `> Block (${height}) not available, chain currently on block ${latestBlock.height}.`,
      );
      console.log("*-*-*-*-*-*-*-*-*-*-*-*-*");
      console.log(`* > Sleeping for ${this.amountToSleep / 1000} s`);
      console.log("*-*-*-*-*-*-*-*-*-*-*-*-*");
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
          console.log(
            "> Tasks for previous loop are running, skipping execution of new loop.",
          );
          // resetting interval time
          this.amountToSleep = 1000;
        } else {
          // Perform the logic here
          await this.loopInnerLogic();
        }
      } catch (err) {
        console.log("\n> Block monitor: Unexpected Error in loopInnerLogic:");
        console.log(err);
        // throw new Error("Error in loopInnerLogic");
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
      console.log("Background loop stopped.");
    }
  }
}

module.exports = Monitor;
