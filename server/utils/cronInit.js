import path from "path";
import { glob } from "glob";
import cron from "node-cron";
import { log } from "@nstation/logger";

import { rootPath } from "@nstation/utils";
import { knex } from "@nstation/db";

import cronsStore from "./cronsStore.js";

let cronDirectories = glob.sync(path.join(rootPath, "src", "crons", "*/"), {
  onlyDirectories: true,
});

for await (const directory of cronDirectories) {
  const cronImport = await import(path.join(directory, "index.js"));
  const cronJob = cronImport.default;

  const dbCron = await knex("nodestation_crons")
    .where({ cron_id: cronJob.id })
    .first();

  if (!!cronJob?.expression) {
    const task = cron.createTask(
      cronJob.expression,
      async () => {
        try {
          await cronJob?.run();

          await knex("nodestation_crons")
            .where({ cron_id: cronJob.id })
            .update({
              last_executed: Math.floor(Date.now() / 1000),
            });

          await log({
            level: "success",
            source: "addon-cron",
            message: `Cron job ${cronJob?.name} executed successfully.`,
          });
        } catch (err) {
          console.error(err);

          await knex("nodestation_crons")
            .where({ cron_id: cronJob.id })
            .update({
              last_executed: Math.floor(Date.now() / 1000),
            });

          await log({
            level: "error",
            source: "addon-cron",
            message: `Cron job ${cronJob?.name} failed to execute.`,
          });
        }
      },
      { name: cronJob?.id }
    );

    if (!!dbCron?.active) {
      task.start();
    }

    cronsStore.push(task);
  }
}
