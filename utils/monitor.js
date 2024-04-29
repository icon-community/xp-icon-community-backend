//
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
  constructor(jvmService, tasks, initBlockHeight = null) {
    if ((jvmService == null, tasks == [])) {
      throw new Error("Invalid argument in Monitor constructor");
    }
    this.jvmService = jvmService;
    this.initBlockHeight = initBlockHeight;
    this.running = false;
    this.timer = null;
    this.currentBlockHeight = null;
    this.tasks = tasks;

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

  async getBlock(height = null) {
    try {
      return await this.getBlockJvm(height);
    } catch (e) {
      void e;
      return null;
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
        const block = await this.getBlock(height);
        if (block != null) {
          this.currentBlockHeight = block.height + 1;

          for (const tx of block.confirmedTransactionList) {
            const txResult = await this.getTxResult(tx.txHash);
            // execute each task asynchronously
            if (this.tasks.length > 0) {
              for (const task of this.tasks) {
                task(txResult);
              }
            }
          }
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
