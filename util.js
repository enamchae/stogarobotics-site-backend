const path = require("path");

module.exports = {
    /**
     * Gets the object representations of the entries from a Sequelize database query result.
     * @param {*} databaseResult Result from a database query.
     * @return The object representation of the found entry.
     */
    val(databaseResult) {
        return Array.isArray(databaseResult)
                ? databaseResult.map(entry => entry.dataValues)
                : databaseResult.dataValues;
    },

    joinUrlPath(...parts) {
        return path.join(...parts).replace(/\\/g, "/");
    },

    ErrorMessageDef: class {
        constructor(name, text) {
            this.name = name;
            this.text = text;
        }
    },
};