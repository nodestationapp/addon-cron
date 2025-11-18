import upsertCron from "./upsertCron.js";
import getCrons from "./getCrons.js";
import deleteCron from "./deleteCron.js";

import getCronsSchema from "../docs/get-crons.js";
import addCronSchema from "../docs/post-cron.js";
import deleteCronSchema from "../docs/delete-cron.js";

import "#server/utils/cronInit.js";

export default [
  {
    method: "GET",
    path: "/admin-api/crons",
    handler: getCrons,
    auth: ["admin"],
    validation: getCronsSchema,
  },
  {
    method: "POST",
    path: "/admin-api/crons",
    handler: upsertCron,
    auth: ["admin"],
    validation: addCronSchema,
  },
  {
    method: "DELETE",
    path: "/admin-api/crons/:id",
    handler: deleteCron,
    auth: ["admin"],
    validation: deleteCronSchema,
  },
];
