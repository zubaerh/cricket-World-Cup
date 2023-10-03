const mongoose = require("mongoose");

const Matche = require("../models/matche");
const Team = require("../models/team");

exports.matches_get_all = (req, res, next) => {
    Matche.find()
    .select("date TeamA_ID TeamB_ID Venue")
    .populate("TeamA_ID", "TeamB_ID")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        matches: docs.map(doc => {
          return {
            _id: doc._id,
            date: doc.date,
            TeamA_ID: doc.TeamA_ID,
            TeamB_ID: doc.TeamB_ID,
            Venue: doc.Venue,
            request: {
              type: "GET",
              url: "http://localhost:3000/matches/" + doc._id
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

exports.matches_create_matche = (req, res, next) => {
    Team.findById(req.body.teamId)
    .then(team => {
      if (!team) {
        return res.status(404).json({
          message: "Team not found"
        });
      }
      const matche = new matche({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        TeamA_ID: req.body.TeamA_ID,
        TeamB_ID: req.body.TeamB_ID,
        Venue: req.body.Venue
      });
      return matche.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Matche stored",
        createdMatche: {
          _id: result._id,
          date: result.date,
          TeamA_ID: result.TeamA_ID,
          TeamB_ID: result.TeamB_ID,
          Venue: result.Venue
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/matches/" + result._id
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

exports.matches_get_matche = (req, res, next) => {
    Matche.findById(req.params.matcheId)
    .populate("TeamA_ID", "TeamB_ID")
    .exec()
    .then(matche => {
      if (!matche) {
        return res.status(404).json({
          message: "Matche not found"
        });
      }
      res.status(200).json({
        matche: matche,
        request: {
          type: "GET",
          url: "http://localhost:3000/matches"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
exports.matches_update_matche = (req, res, next) => {
    const id = req.params.matcheId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Matche.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Matche updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/matches/" + id
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
exports.matches_delete_matche = (req, res, next) => {
    Matche.remove({ _id: req.params.matcheId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Matche deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/matches",
          body: { matcheId: "ID", date: "Date", Venue: "String" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
