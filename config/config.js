const {ErrorMessageDef} = require("../util");

module.exports = {
    rootUrl: "/stogarobotics/",

    galleryImageBaseUrl: "/img/gallery/",
    memberIconBaseUrl: "/img/member/",

    memberIconDefaultUrl: "special/default.png",

    memberDefaultRole: "Team member",

    errorMessages: {
        "400": new ErrorMessageDef("Bad request", "There might be a bad character in the URL breaking things. Check for misplaced “%” symbols and other such characters with special meaning."),
        "404": new ErrorMessageDef("Not found", "Nothing to see here. Move along…"),
        "500": new ErrorMessageDef("Internal server error", "An error was raised in the server’s code. Oopsie."),
    },

    errorMessageTextDefault: "Unfortunately, it seems we’ve let you down. Apologies.",

    seasons: {
        "2008": "Bridge Battle",
        "2009": "Elevation",
        "2010": "Clean Sweep",
        "2011": "Round Up",
        "2012": "Gateway",
        "2013": "Sack Attack",
        "2014": "Toss Up",
        "2015": "Skyrise",
        "2016": "Starstruck",
        "2017": "Nothing but Net",
        "2018": "In the Zone",
        "2019": "Turning Point",
        "2020": "Tower Takeover",
    },

    currentSeason: "2020",
};