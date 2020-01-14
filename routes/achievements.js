const express = require("express");

const router = express.Router();

const db = require("../db/models");
const {val} = require("../util");

router.get("/", async (req, res) => {
    res.render("achievements", {
        docTitle: "Achievements",
        bodyClassName: "achievementspage",
        teams: val(await db.Team.findAll()),
    });
});

module.exports = router;
