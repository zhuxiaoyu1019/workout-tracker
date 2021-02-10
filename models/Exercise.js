const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    sets: Number,
    reps: Number,
    weights: Number,
    duration: Number,
    distance: Number
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;