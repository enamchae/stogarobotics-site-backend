'use strict';
module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define('Team', {
        number: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        number_short: DataTypes.STRING,
        intro: DataTypes.STRING,
        header_media_url: DataTypes.STRING,
        header_media_vertical_offset: DataTypes.INTEGER,
    }, {
        timestamps: false,
    });
    Team.associate = function(models) {
        // associations can be defined here
    };
    return Team;
};