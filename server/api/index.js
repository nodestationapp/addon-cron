import addCron from "./addCron.js";
import getCrons from "./getCrons.js";
import deleteCron from "./deleteCron.js";

import authMiddleware from "@nstation/auth/utils/authMiddleware.js";

import "#server/utils/cronWorker.js";

export default [
  {
    method: "GET",
    path: "/admin-api/crons",
    handler: getCrons,
    middlewares: [authMiddleware(["admin"])],
  },
  {
    method: "POST",
    path: "/admin-api/crons",
    handler: addCron,
    middlewares: [authMiddleware(["admin"])],
  },
  {
    method: "DELETE",
    path: "/admin-api/crons/:id",
    handler: deleteCron,
    middlewares: [authMiddleware(["admin"])],
  },
];
