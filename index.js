// Imports
const express = require("express");
const handlebars = require("express-handlebars");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const config = require("./config-util");

const db = require("./db/models/");
const {val} = require("./util");

// Setup express
const app = express();

// view engine setup
const handlebarsInstance = handlebars.create({
    helpers: {
        ["cat"](...parts) {
            parts.pop();
            return parts.join("");
        },

        ["root-link"](...addends) {
            addends.pop();
            return config.prefixRootUrl(...addends);
        },
    },

    extname: "hbs",
});

app.engine("hbs", handlebarsInstance.engine)
        .set("views", path.join(__dirname, "views"))
        .set("view engine", "hbs")

        .use(logger("dev"))
        .use(express.json())
        .use(express.urlencoded({extended: false}))
        .use(cookieParser())

        .use(config.rootUrl, express.static(path.join(__dirname, "public")));

for (const [route, router] of Object.entries({
    "": require("./routes/home"),
    "about": require("./routes/about"),
    "achievements": require("./routes/achievements"),
    "teams": require("./routes/teams"),
    "gallery": require("./routes/gallery"),
})) {
    app.use(config.prefixRootUrl(route), router);
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(async (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    const status = err.status || 500;
    const errorMessage = config.errorFromStatus(status);

    res.status(status);
    res.render("error", {
        docTitle: `Error ${status}`,
        teams: val(await db.Team.findAll()),

        errorCode: status,
        errorName: errorMessage.name,
        errorText: errorMessage.text,
    });
});

module.exports = app;
