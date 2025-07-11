import App from "./app.js";

export default {
  register(app) {
    app.addMenuLink({
      order: 5,
      icon: "lucide:timer",
      to: `/crons`,
      label: "Crons",
      Component: App,
    });
  },
};
