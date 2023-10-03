const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const MatchesController = require('../controllers/matches');

// Handle incoming GET requests to /orders
router.get("/", checkAuth, MatchesController.matches_get_all);

router.post("/", checkAuth, MatchesController.matches_create_matche);

router.get("/:matcheId", checkAuth, MatchesController.matches_get_matche);

router.delete("/:matcheId", checkAuth, MatchesController.matches_delete_matche);

module.exports = router;
