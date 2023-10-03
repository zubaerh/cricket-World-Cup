const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const TeamsController = require('../controllers/teams');


router.get("/", TeamsController.teams_get_all);

router.post("/", checkAuth, TeamsController.teams_create_team);

router.get("/:teamId", TeamsController.teams_get_team);

router.patch("/:teamId", checkAuth, TeamsController.teams_update_team);

router.delete("/:teamId", checkAuth, TeamsController.teams_delete);

module.exports = router;
