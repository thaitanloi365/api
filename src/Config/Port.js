function setup(app) {
  app.set("port", process.env.PORT || 3000);
  app.listen(app.get("port"), () => {
    console.log("Express server listening on port %d in %s mode", app.get("port"), app.get("env"));
  });
}

export default {
  setup
};
