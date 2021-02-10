const db = require("../models");

module.exports = function (app) {
    app.get("/workouts", (req, res) => {
        db.Workout.find()
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/addWorkout", ({ body }, res) => {
        db.Workout.create(body)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.post("/addExercise/:date", (req, res) => {
        db.Exercise.create(req.body)
            .then(({ _id }) => db.Workout.findOneAndUpdate({ date: req.params.date }, { $push: { exercises: _id } }, { new: true }))
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.get("/allWorkouts", (req, res) => {
        db.Workout.find()
            .populate("exercises")
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.get("/exercise/:id", (req, res) => {
        db.Exercise.findOne({ _id: req.params.id })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.put("/edit/:id", (req, res) => {
        db.Exercise.findOneAndUpdate({ _id: req.params.id }, req.body)
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });

    app.delete("/delete/:id", (req, res) => {
        db.Exercise.deleteOne({ _id: req.params.id })
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    });
}