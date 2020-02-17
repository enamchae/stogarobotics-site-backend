/**
 * @file Controls all requests to the /teams/ route, which supplies pages about each team.
 */

const express = require("express");

const router = express.Router();

const db = require("../db/models");
const {val} = require("../util");

const config = require("../config-util");

// Redirect to the section on the homepage if no team is specified
function redirectToHome(res) {
    res.redirect(config.prefixRootUrl("/#teams"));
}
router.get("/", (req, res) => {
    redirectToHome(res);
});

router.get("/:teamNumber/", async (req, res) => {
    // Find if there is a team under the given team number
    const teamResult = await db.Team.findByPk(req.params.teamNumber.toUpperCase());

    if (!teamResult) {
        redirectToHome(res);
        return;
    }

    const team = val(teamResult);

    // Get the team members and their icons
    const members = val(await db.Member.findAll({
        where: {
            team_number: team.number,
        },
    }));

    
    for (let i = 0; i < members.length; i++) {
        const member = members[i];

        // Hide members without icons
        if (!member.icon_url) {
            members.splice(i, 1);
            i--;
            continue;
        }

        member.icon_url = config.prefixRootUrl(config.json.memberIconBaseUrl, member.icon_url);
        // member.icon_url = config.prefixRootUrl(config.json.memberIconBaseUrl, member.icon_url || config.json.memberIconDefaultUrl);
        member.team_role = member.team_role || config.json.memberDefaultRole;
    }

    // Get the team gallery images
    const galleryOther = val(await db.Image.findAll({
        where: {
            team_number: team.number,
        },

        order: [
            ["season", "DESC"],
        ],
    }));

    const galleryFirst = galleryOther.shift();

    res.render("teams", {
        docTitle: `Team ${team.number}`,
        docDesc: `See Team ${team.number}’s roster, statistics, and upcoming events!`,
        bodyClassName: "teampage",
        teams: val(await db.Team.findAll()),

        team,
        members,

        imageSrcInit: galleryFirst ? config.prefixRootUrl(config.json.galleryImageBaseUrl, galleryFirst.image_url) : "",
        imageSrcOthers: JSON.stringify(galleryOther.map(image => config.prefixRootUrl(config.json.galleryImageBaseUrl, image.image_url))),

        imageCaptionInit: galleryFirst ? config.captionTeamImage(galleryFirst) : "",
        imageCaptionOthers: JSON.stringify(galleryOther.map(image => config.captionTeamImage(image))),

        seasonString: config.seasonString(),
    });
});

module.exports = router;
