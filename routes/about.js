const express = require("express");

const router = express.Router();

const db = require("../db/models");
const {val} = require("../util");

const config = require("../config-util");

router.get("/", async (req, res) => {

    res.render("about", {
        docTitle: "About",
        bodyClassName: "aboutpage",
        teams: val(await db.Team.findAll()),

        // worldsImageSrcInit: imageInit ? prefixSrc(imageInit) : "",
        // worldsImageSrcOthers: JSON.stringify(images.map(prefixSrc)),

        // worldsImageCaptionInit: captionInit ? captionInit : "",
        // worldsImageCaptionOthers: JSON.stringify(captions),

        worlds: await queryDbImages(1, image => `Team ${image.team_number} at Worlds!`),
        ym: await queryDbImages(2, () => "Youth mentors at the middle schools!"),
        vrc: await queryDbImages(3, () => "Building robots and competing for VRC matches."),
    });

    async function queryDbImages(category, toCaptionString) {
        // 1: worlds
        // 2: youth mentorship
        // 3: vrc

        const images = val(await db.Image.findAll({
            where: {
                about_page_category: category,
            },
    
            order: [
                ["season", "DESC"],
            ],
        }));

        const captions = images.map(image => config.captionString(toCaptionString(image), image.season));

        const imageInit = images.shift();
        const captionInit = captions.shift();

        return {
            srcInit: imageInit ? prefixSrc(imageInit) : "",
            srcOthers: JSON.stringify(images.map(prefixSrc)),

            captionInit: captionInit || "",
            captionOthers: JSON.stringify(captions),
        };
    }

    function prefixSrc(image) {
        return config.prefixRootUrl(config.json.galleryImageBaseUrl, image.image_url);
    }
});

module.exports = router;
