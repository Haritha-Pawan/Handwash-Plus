
const timestamp = () => new Date().toISOString();


const origConsole = console;


console.info = (msg, ...args) =>
  origConsole.log(`\x1b[36m[INFO] [${timestamp()}] ${msg}\x1b[0m`, ...args);

console.warn = (msg, ...args) =>
  origConsole.log(`\x1b[33m[WARN] [${timestamp()}] ${msg}\x1b[0m`, ...args);

console.error = (msg, ...args) =>
  origConsole.log(`\x1b[31m[ERROR] [${timestamp()}] ${msg}\x1b[0m`, ...args);


console.success = (msg, ...args) =>
  origConsole.log(`\x1b[32m[SUCCESS] [${timestamp()}] ${msg}\x1b[0m`, ...args);