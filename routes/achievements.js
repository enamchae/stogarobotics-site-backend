const express = require("express");

const router = express.Router();

const db = require("../db/models");
const {val} = require("../util");

router.get("/", async (req, res) => {
    res.render("achievements", {
        docTitle: "Achievements",
        docDesc: "See the event and award history of the Conestoga High School Robotics Team!",
        bodyClassName: "achievementspage",
        teams: val(await db.Team.findAll()),
    });
});

module.exports = router;
