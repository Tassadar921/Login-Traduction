"use strict";
exports.__esModule = true;
var account_1 = require("./account");
exports["default"] = accountRouting;
var accountRouting;
(function (accountRouting) {
    function init(app) {
        app.post('/userExists', function (req, res) {
            account_1.account.userExists(req.body.username, req.body.email, res);
        });
        app.post('/mailCreateAccount', function (req, res) {
        });
        app.post('/checkSignUpToken', function (req, res) {
        });
        app.post('/createAccount', function (req, res) {
        });
        app.post('/signIn', function (req, res) {
        });
        app.post('/mailResetPassword', function (req, res) {
        });
        app.post('/checkResetPasswordToken', function (req, res) {
        });
        app.post('/resetPassword', function (req, res) {
        });
        console.log('Account routing initialized');
    }
    accountRouting.init = init;
})(accountRouting || (accountRouting = {}));
