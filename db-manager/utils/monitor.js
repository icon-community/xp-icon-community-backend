//
/*
 * Monitor class to monitor the JVM chain for new blocks and transactions.
 * The class uses the JVM service to get blocks and transactions.
 * The class is designed to be run in the background.
 */
const { getPRepTerm } = require("./json-rpc-services");
class Monitor {
  // Constructor for the Monitor class.
  // jvmService: The JVM service to use for getting blocks and transactions.
  // initBlockHeight: The initial block height to start monitoring from.
  //                 If not provided, the monitor will start from the latest block.
  //                 If provided, the monitor will start from the provided block height.
  //
  constructor(jvmService, tasks = [], jvmBuilder, initBlockHeight = null) {
    if (jvmService == null || tasks == null || jvmBuilder == null) {
      throw new Error("Invalid argument in Monitor constructor");
    }
    this.jvmService = jvmService;
    this.jvmBuilder = jvmBuilder;
    this.initBlockHeight = initBlockHeight;
    this.running = false;
    this.timer = null;
    this.currentBlockHeight = null;
    this.tasks = tasks;
    this.latestTerm = null;
    this.executeTasks = false;
    this.blockHeightIncrement = 10000;

    // this.filterResponseMessageEvent =
    //   this.filterResponseMessageEvent.bind(this);
  }

  getCurrentBlockHeight() {
    return this.currentBlockHeight;
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

  async getTxResult(txHash) {
    const maxLoops = 10;
    let loop = 0;
    while (loop < maxLoops) {
      try {
        return await this.jvmService.getTransactionResult(txHash).execute();
      } catch (e) {
        void e;
        loop++;
        await this.sleep(1000);
      }
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async checkoutChainTerm(height) {
    const response = await getPRepTerm(height);
    if (response != null && response.sequence != null) {
      if (this.latestTerm === response.sequence) {
        // term period is the same, no need to execute tasks
        this.executeTasks = false;
        return;
      }
      this.latestTerm = response.sequence;
      this.executeTasks = true;
    }
  }

  async runLoop() {
    this.timer = setTimeout(async () => {
      if (this.running) {
        const height =
          this.currentBlockHeight !== null
            ? this.currentBlockHeight
            : this.initBlockHeight == null
              ? null
              : this.initBlockHeight;
        const block = await this.getBlockJvm(height);
        if (block != null) {
          // DEBUG PRINT
          // console.log("block data");
          // console.log(block);

          // fetch network info from this block to see if term has changed
          await this.checkoutChainTerm(height);
          // DEBUG PRINT
          if (this.executeTasks) {
            console.log("latest term: ", this.latestTerm);
            if (this.tasks.length > 0) {
              console.log("Executing tasks");
              for (const task of this.tasks) {
                await task(block);
              }
            } else {
              console.log("No tasks to execute");
            }
          }
          this.currentBlockHeight = block.height + this.blockHeightIncrement;
        } else {
          await this.sleep(1000);
        }

        this.runLoop();
      }
    }, 1000); // Adjust the interval as needed
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
