//
const Monitor = require("./utils/monitor");
const { JVM_SERVICE, IconBuilder } = require("./utils/utils");

const INIT_BLOCK_HEIGHT = 80670350;
async function task(input) {
  const f = {
    blockHeight: input.height,
  };
  console.log(f);
}
async function main() {
  const tasks = [task];
  const monitor = new Monitor(
    JVM_SERVICE,
    tasks,
    IconBuilder,
    INIT_BLOCK_HEIGHT,
  );

  // start monitor
  monitor.start();

  // run monitor for 20 seconds
  setTimeout(() => {
    monitor.stop();
  }, 20000);
}

main();
