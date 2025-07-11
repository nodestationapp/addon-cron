import addCron from "./addCron.js";
import getCrons from "./getCrons.js";
import deleteCron from "./deleteCron.js";

import authMiddleware from "@nstation/auth/utils/authMiddleware.js";

import "#server/utils/cronWorker.js";

export default [
  {
    method: "GET",
    path: "/crons",
    type: "admin",
    handler: getCrons,
    middlewares: [authMiddleware(["admin"])],
  },
  {
    method: "POST",
    path: "/crons",
    type: "admin",
    handler: addCron,
    middlewares: [authMiddleware(["admin"])],
  },
  {
    method: "DELETE",
    path: "/crons/:id",
    type: "admin",
    handler: deleteCron,
    middlewares: [authMiddleware(["admin"])],
  },
];
