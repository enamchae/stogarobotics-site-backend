'use strict';
module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
        name: DataTypes.STRING,
        team_number: DataTypes.STRING,
        is_team_captain: DataTypes.BOOLEAN,
        team_role: DataTypes.STRING,
        icon_url: DataTypes.STRING
    }, {
        timestamps: false,
    });
    Member.associate = function(models) {
        // associations can be defined here
    };
    return Member;
};