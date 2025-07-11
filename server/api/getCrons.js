import fs from "fs";
import path from "path";
import { glob } from "glob";
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

  const activeMatch = source.match(/active\s*:\s*([^,]+)/);
  if (!activeMatch) throw new Error("Cron active not found");
  const active = activeMatch[1];

  const runMatch = source.match(
    /run\s*:\s*(?:async\s*)?\(\)\s*=>\s*{([^]*)}\s*,?\s*$/m
  );
  if (!runMatch) throw new Error("Cron run function not found");
  const runBody = runMatch[1].trim();

  return { id, name, expression, active, content: runBody };
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
    let emailFiles = glob.sync(path.join(rootPath, "src", "crons", "*.js"));

    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    let emails = [];

    for (const file of emailFiles) {
      let email = fs.readFileSync(file, "utf8");
      email = convertExportDefault(email);
      emails.push(email);
    }

    if (!!sort) {
      emails.sort((a, b) =>
        sort?.sort === "asc"
          ? a[sort?.field].localeCompare(b[sort?.field])
          : b[sort?.field].localeCompare(a[sort?.field])
      );
    }

    const paginatedFiles = emails.slice(startIndex, endIndex);

    return res.status(200).json({
      data: paginatedFiles,
      meta: { page: page, pageSize, count: emailFiles.length },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
