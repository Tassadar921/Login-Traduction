"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { account } from "./account";
var accountRouting;
(function (accountRouting) {
    function init(app) {
        app.post('/userExists', function (req, res) {
            // account.userExists(req.body.username, req.body.email, res);
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
        return;
    }
    accountRouting.init = init;
})(accountRouting || (accountRouting = {}));
exports.default = accountRouting;
