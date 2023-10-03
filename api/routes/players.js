const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PlayersController = require('../controllers/players');

// Handle incoming GET requests to /orders
router.get("/", checkAuth, PlayersController.players_get_all);

router.post("/", checkAuth, PlayersController.players_create_player);

router.get("/:playerId", checkAuth, PlayersController.players_get_player);

router.delete("/:playerId", checkAuth, PlayersController.players_delete_player);

module.exports = router;
