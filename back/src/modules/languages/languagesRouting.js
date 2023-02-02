"use strict";
exports.__esModule = true;
var languages_1 = require("./languages");
exports["default"] = languagesRouting;
var languagesRouting;
(function (languagesRouting) {
    function init(app) {
        app.get('/languages/list', function (req, res) {
            languages_1.languages.getLanguagesList(res);
        });
        app.get('/languages/:language', function (req, res) {
            languages_1.languages.getLanguagesOf(req.params.language, res);
        });
        console.log('Languages routing initialized');
    }
    languagesRouting.init = init;
})(languagesRouting || (languagesRouting = {}));
