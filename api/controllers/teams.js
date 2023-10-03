const mongoose = require("mongoose");
const Team = require("../models/team");

exports.teams_get_all = (req, res, next) => {
    Team.find()
    .select("country")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        teams: docs.map(doc => {
          return {
            country: doc.country,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/teams/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.teams_create_team = (req, res, next) => {
  const team = new Team({
    _id: new mongoose.Types.ObjectId(),
    country: req.body.country
  });
  team
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created team successfully",
        createdTeam: {
            country: result.country,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/teams/" + result._id
          }
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

exports.teams_get_team = (req, res, next) => {
  const id = req.params.teamId;
  Team.findById(id)
    .select("country")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            team: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/teams"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.teams_update_team = (req, res, next) => {
  const id = req.params.teamId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Team.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Team updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/teams/" + id
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

exports.teams_delete = (req, res, next) => {
  const id = req.params.teamId;
  Team.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Team deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/teams",
          body: { teamId: "ID", country: "String" }
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
