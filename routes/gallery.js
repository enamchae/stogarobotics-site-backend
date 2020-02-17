const express = require("express");

const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

const router = express.Router();

const db = require("../db/models");
const {val} = require("../util");

const config = require("../config-util");

router.get("/api/", async (req, res) => {
    res.json({success: true});
});

router.get("/api/images", async (req, res) => {
    const getListFromQuery = varName => req.query[varName] ? req.query[varName].toUpperCase().split(",") : false;

    try {
        const apiResponse = {};

        const teamsTarget = getListFromQuery("teams");
        const seasonsTarget = getListFromQuery("seasons");

        const limit = parseInt(req.query.n_results);
        const offset = parseInt(req.query.n_offset || 0);

        // Sequelize WHERE queries do not allow setting a property to undefined
        const restraints = {};
        if (teamsTarget) {
            restraints.team_number = teamsTarget;
        }
        if (seasonsTarget) {
            restraints.season = seasonsTarget;
        }

        apiResponse.result = val(await db.Image.findAll({
            where: restraints,

            order: [
                ["season", "DESC"], // most recent images first
                ["id", "DESC"], // then most recently added images first
            ],

            limit: !isNaN(limit) ? limit : undefined,
            offset,
        }));

        // Groom each object to make them more fetcher-friendly
        for (const image of apiResponse.result) {
            // image.image_url = config.prefixRootUrl(config.json.galleryImageBaseUrl, image.image_url);

            delete image.id;
            delete image.about_page_category;
        }

        apiResponse.n_total_matching_entries = (await db.Image.findAll({where: restraints})).length;

        apiResponse.success = true;
        res.json(apiResponse);

    } catch (error) {
        console.log(error);

        const apiResponse = {};

        apiResponse.success = false;
        apiResponse.errorMessage = "internal server error";
        res.json(apiResponse);
    }
});

// Sizedown API for faster loading
router.get("/thumb/:filename", async (req, res) => {
    // Image data is written to disk instead of memory since it is faster and more stable

    // Path of the temporary image file
    const pathTmp = path.join("./tmp/", req.params.filename);

    const readStream = fs.createReadStream(path.join("./public/img/gallery/", req.params.filename));
    const writeStreamTmp = fs.createWriteStream(pathTmp);

    writeStreamTmp.on("finish", () => {
        // Send the file when it is finished being written
        res.sendFile(path.resolve(pathTmp));
    });

    res.on("finish", () => {
        // Delete the file when it has been sent
        fs.unlinkSync(pathTmp);
    });

    // Resize the image and write it to a file
    const transformation = sharp().resize({width: 400}).toFormat("jpeg");
    readStream.pipe(transformation).pipe(writeStreamTmp);
});

router.get("/", async (req, res) => {
    res.render("gallery", {
        docTitle: "Gallery",
        docDesc: "The Conestoga High School Robotics Team’s photo library, taken across numerous seasons of robotics action!",
        bodyClassName: "gallerypage",
        teams: val(await db.Team.findAll()),

        autoLoadImages: val(await db.Image.findAll({
            limit: 24,

            order: [
                ["id", "DESC"],
            ],
        })),
    });
});

module.exports = router;
