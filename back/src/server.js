"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var dotenv = require("dotenv");
var languagesRouting_1 = require("./modules/languages/languagesRouting");
var accountRouting_1 = require("./modules/account/accountRouting");
dotenv.config();
var app = (0, express_1["default"])();
app.use(body_parser_1["default"].json());
app.use((0, cors_1["default"])({ origin: 'http://localhost:8100' }));
app.use('/files', express_1["default"].static('files'));
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}
languagesRouting_1["default"].init(app);
accountRouting_1["default"].init(app);
if (app.listen(process.env.PORT || 8080)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log('    =============   PORT: 8080   =============');
}
