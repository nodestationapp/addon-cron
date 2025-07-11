import path from "path";
import { promises as fs_promise } from "fs";
import { rootPath } from "@nstation/utils";

export default async (req, res) => {
  try {
    await fs_promise.unlink(
      path.join(rootPath, "src", "crons", `${req?.params?.id}.js`)
    );

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
