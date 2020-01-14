const {joinUrlPath, ErrorMessageDef} = require("./util");

module.exports = {
    json: require("./config/config"),
    
    errorFromStatus(status) {
        return this.json.errorMessages[status] || new ErrorMessageDef("", this.json.errorMessageTextDefault);
    },

    prefixRootUrl(...parts) {
        return joinUrlPath(this.rootUrl, ...parts);
    },

    seasonString(year=this.json.currentSeason) {
        if (!year) {
            return "";
        }

        year = parseInt(year);

        const seasonName = this.json.seasons[year];
        return `(${year - 1}–${year}${seasonName ? ` — ${seasonName}` : ""})`;
    },

    captionString(string, season) {
        const seasonString = this.seasonString(season);

        return (string ? string : "")
                + (string && seasonString ? " " : "")
                + (seasonString ? seasonString : "");
    },

    captionTeamImage(dbResultImage) {
        return this.captionString(dbResultImage.caption, dbResultImage.season);
    },

    get rootUrl() {
        return joinUrlPath("/", this.json.rootUrl);
    },
};