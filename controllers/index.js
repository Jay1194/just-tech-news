const router = require("express").Router();
const apiRoutes = require("./api/");
const homeRoutes = require("./home-routes.js");

router.use("/", homeRoutes);
// here we are collecting the packaged group of API endpoints and prefixing them with the path /api
router.use("/api", apiRoutes);

// note that second use of router.use(). This is so if we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating we have requested an incorrect resource, another RESTful API practice.
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
