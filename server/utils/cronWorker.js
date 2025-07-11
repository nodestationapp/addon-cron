import path from "path";
import { glob } from "glob";
import cron from "node-cron";
import { rootPath } from "@nstation/utils";

let cronFiles = glob.sync(path.join(rootPath, "src", "crons", "*.js"));

for await (const file of cronFiles) {
  const cronImport = await import(file);
  const cronJob = cronImport.default;

  if (!!cronJob?.expression && cronJob?.active) {
    cron.schedule(cronJob.expression, async () => {
      try {
        await cronJob?.run();
      } catch (err) {
        console.error(err);
      }
    });
  }
}
