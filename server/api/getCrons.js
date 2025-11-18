import fs from "fs";
import path from "path";
import { glob } from "glob";

import { knex } from "@nstation/db";
import { rootPath } from "@nstation/utils";

function convertExportDefault(source) {
  const idMatch = source.match(/id\s*:\s*["']([^"']+)["']/);
  if (!idMatch) throw new Error("Cron id not found");
  const id = idMatch[1];

  const nameMatch = source.match(/name\s*:\s*["']([^"']+)["']/);
  if (!nameMatch) throw new Error("Cron name not found");
  const name = nameMatch[1];

  const expressionMatch = source.match(/expression\s*:\s*["']([^"']+)["']/);
  if (!expressionMatch) throw new Error("Cron expression not found");
  const expression = expressionMatch[1];

  return { id, name, expression };
}

export default async (req, res) => {
  let { page = 0, sort, pageSize = 20 } = req.query;

  if (!!sort) {
    sort = sort?.split(":");
    sort = {
      field: sort?.[0],
      sort: sort?.[1],
    };
  }

  try {
    let cronDirectories = glob.sync(path.join(rootPath, "src", "crons", "*/"), {
      onlyDirectories: true,
    });

    let crons = [];

    for await (const directory of cronDirectories) {
      let cron = fs.readFileSync(path.join(directory, "index.js"), "utf8");
      const content = fs.readFileSync(path.join(directory, "run.js"), "utf8");

      cron = convertExportDefault(cron);

      const dbCron = await knex("nodestation_crons")
        .where({ cron_id: cron.id })
        .first();

      crons.push({
        ...cron,
        content,
        active: !!dbCron?.active,
        last_executed: dbCron?.last_executed,
      });
    }

    if (!!sort) {
      crons.sort((a, b) =>
        sort?.sort === "asc"
          ? a[sort?.field].localeCompare(b[sort?.field])
          : b[sort?.field].localeCompare(a[sort?.field])
      );
    }

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedFiles = crons.slice(startIndex, endIndex);

    return res.status(200).json({
      data: paginatedFiles,
      meta: { page: page, pageSize, count: cronDirectories.length },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
