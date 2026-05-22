export function registerProcessHandlers() {
  process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    console.error(err);
    process.exit(1);
  });
}

