const mongoose = require("mongoose");

const Player = require("../models/player");
const Team = require("../models/team");

exports.players_get_all = (req, res, next) => {
    Player.find()
    .select("name team_ID jersey_No")
    .populate("team_ID")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            team_ID: doc.team_ID,
            jersey_No: doc.jersey_No,
            request: {
              type: "GET",
              url: "http://localhost:3000/players/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.players_create_player = (req, res, next) => {
    Team.findById(req.body.teamId)
    .then(team => {
      if (!team) {
        return res.status(404).json({
          message: "Team not found"
        });
      }
      const player = new player({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        team_ID: req.body.team_ID,
        jersey_No: req.body.jersey_No
      });
      return player.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Player stored",
        createdPlayer: {
          _id: result._id,
          name: result.name,
          team_ID: result.team_ID,
          jersey_No: result.jersey_No
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/players/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.players_get_player = (req, res, next) => {
    Player.findById(req.params.playerId)
    .populate("team_ID")
    .exec()
    .then(player => {
      if (!player) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        player: player,
        request: {
          type: "GET",
          url: "http://localhost:3000/players"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
exports.players_update_player = (req, res, next) => {
    const id = req.params.playerId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Player.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "player updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/players/" + id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };
exports.players_delete_player = (req, res, next) => {
    Player.remove({ _id: req.params.playerId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Player deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/players",
          body: { playerId: "ID", name: "String", jersey_No: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
