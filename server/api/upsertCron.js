import path from "path";
import { knex } from "@nstation/db";
import { promises as fs_promise } from "fs";
import { rootPath } from "@nstation/utils";

import cronsStore from "#server/utils/cronsStore.js";

export default async (req, res) => {
  let body = req?.body;
  if (!body?.id) {
    body.id = Math.floor(Math.random() * 1000000)?.toString();
  }

  try {
    if (process.env.NODE_ENV === "development") {
      await fs_promise.mkdir(path.join(rootPath, "src", "crons", body?.id), {
        recursive: true,
      });

      const content =
        `import run from "./run.js";\n\n` +
        `export default {\n` +
        `  id: "${body?.id}",\n` +
        `  name: "${body?.name}",\n` +
        `  expression: "${body?.expression}",\n` +
        `  run\n` +
        `};\n`;

      await fs_promise.writeFile(
        path.join(rootPath, "src", "crons", body?.id, "index.js"),
        content
      );
      await fs_promise.writeFile(
        path.join(rootPath, "src", "crons", body?.id, "run.js"),
        body?.content
      );
    }

    const existing = await knex("nodestation_crons")
      .where({ cron_id: body?.id })
      .first();

    if (existing) {
      await knex("nodestation_crons")
        .where({ id: existing.id })
        .update({
          active: body?.active ? 1 : 0,
          updated_at: Date.now(),
        });

      const task = cronsStore.find((item) => item.name === body?.id);

      if (!!body?.active) {
        task.start();
      } else {
        task.stop();
      }
    } else {
      await knex("nodestation_crons").insert({
        cron_id: body?.id,
        active: body?.active ? 1 : 0,
      });
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
