const express = require("express");

const router = express.Router();

const db = require("../db/models");
const {val} = require("../util");

router.get("/", async (req, res) => {
    res.render("home", {
        docTitle: "Home",
        bodyClassName: "homepage",
        teams: val(await db.Team.findAll()),
    });
});

module.exports = router;
