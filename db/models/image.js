'use strict';
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        image_url: DataTypes.STRING,
        caption: DataTypes.STRING,
        team_number: DataTypes.STRING,
        season: DataTypes.STRING,
        about_page_category: DataTypes.INTEGER,
    }, {
        timestamps: false,
    });
    Image.associate = function(models) {
        // associations can be defined here
    };
    return Image;
};