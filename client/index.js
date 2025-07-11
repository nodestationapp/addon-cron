import App from "./app.js";
import CronTableType from "./components/CronTableType.js";

export default {
  register(app) {
    app.addMenuLink({
      order: 5,
      icon: "lucide:timer",
      to: `/crons`,
      label: "Crons",
      Component: App,
    });

    app.addHook("logger.table.types", [
      {
        type: "addon-cron",
        Component: (props) => <CronTableType {...props} />,
      },
    ]);
  },
};
