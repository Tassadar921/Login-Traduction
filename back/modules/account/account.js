"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.account = void 0;
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var edgedb = require("edgedb");
var accountRequest_1 = require("./accountRequest");
var account;
(function (account) {
    var client = edgedb.createClient({});
    //init of the mail sender
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    //mail options of subject, text and receiver
    var mailOptions = {
        from: process.env.EMAIL,
        to: '',
        subject: '',
        text: ''
    };
    //asks if an account containing username or email is in db, priority to username
    function userExists(username, email, res) {
        accountRequest_1.accountRequest.checkUser(username, email, client);
    }
    account.userExists = userExists;
    ;
    //sends the creating account email, containing a unique token, effective for 5 minutes,
    // temporary saving datas in the signUp queue
    module.exports.mailCreateAccount = function (username, password, email, language, res) {
        var dictionnary = require('../files/json/translation/' + language + '.json');
        var token = generateToken();
        clearCreatingAccountQueue('', email);
        creatingAccountQueue.push({ token: token, username: username, password: password, email: email });
        setTimeout(clearCreatingAccountQueue, 300000, token);
        mailOptions.to = email;
        mailOptions.subject = dictionnary.mail[0].data;
        mailOptions.text = dictionnary.mail[1].data.replace('username', username)
            + urlFront
            + 'conf-account?token='
            + token;
        transporter.sendMail(mailOptions, function (error) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (error) {
                        res.json({ status: 0, message: dictionnary.mail[2].data });
                    }
                    else {
                        res.json({ status: 1, message: dictionnary.mail[3].data });
                    }
                    return [2 /*return*/];
                });
            });
        });
    };
    //asks if token is in the signUp queue
    module.exports.checkSignUpToken = function (token, language, res) {
        var dictionnary = require('../files/json/translation/' + language + '.json');
        for (var _i = 0, creatingAccountQueue_1 = creatingAccountQueue; _i < creatingAccountQueue_1.length; _i++) {
            var line = creatingAccountQueue_1[_i];
            if (line.token === token) {
                res.json({ status: 1, message: dictionnary.mail[4].data });
                return 1;
            }
        }
        res.json({ status: 0, message: dictionnary.mail[5].data });
        return 0;
    };
    //creates the account with datas in the queue linked to token
    module.exports.createAccount = function (token, language, con, res) {
        var dictionnary = require('../files/json/translation/' + language + '.json');
        var _loop_1 = function (line) {
            if (line.token === token) {
                con.query('INSERT INTO users (username, password, email) VALUES (?,?,?)', [line.username, ash(line.password), line.email], function (err) {
                    if (err) {
                        throw err;
                    }
                    else {
                        var username = line.username;
                        clearCreatingAccountQueue(line.token);
                        res.json({ status: 1, message: dictionnary.server[2].data, username: username });
                    }
                });
            }
        };
        for (var _i = 0, creatingAccountQueue_2 = creatingAccountQueue; _i < creatingAccountQueue_2.length; _i++) {
            var line = creatingAccountQueue_2[_i];
            _loop_1(line);
        }
    };
    //signIn, identifier can be either username or email
    module.exports.signIn = function (identifier, password, language, con, res) {
        var dictionnary = require('../files/json/translation/' + language + '.json');
        con.query('SELECT username FROM users WHERE (username = ? OR email = ?)', [identifier, identifier], function (e, r) {
            if (e) {
                throw e;
            }
            else {
                if (!r.length) {
                    res.json({ status: 0, message: dictionnary.mail[6].data });
                }
                else {
                    con.query('SELECT username FROM users WHERE (username = ? OR email = ?) AND password = ?', [identifier, identifier, ash(password)], function (er, re) {
                        if (er) {
                            throw er;
                        }
                        else {
                            if (re.length) {
                                res.json({ status: 1, message: '', username: re[0].username });
                            }
                            else {
                                res.json({ status: 0, message: dictionnary.mail[7].data });
                            }
                        }
                    });
                }
            }
        });
    };
    //sends an email containing a unique token to reset the password, effective for 5 minutes
    //temporary linking the token and email in the resetPassword queue
    module.exports.mailResetPassword = function (email, language, con, res) {
        con.query('SELECT email FROM users WHERE email = ?', email, function (e, r) {
            if (e) {
                throw e;
            }
            else {
                var dictionnary_1 = require('../files/json/translation/' + language + '.json');
                if (r.length) {
                    var token = generateToken();
                    clearResetPasswordQueue('', email);
                    resetPasswordQueue.push({ token: token, email: email });
                    setTimeout(clearResetPasswordQueue, 300000, token);
                    mailOptions.to = email;
                    mailOptions.subject = dictionnary_1.mail[8].data;
                    mailOptions.text = dictionnary_1.mail[9].data
                        + urlFront
                        + 'reset-password?token='
                        + token;
                    transporter.sendMail(mailOptions, function (error) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (error) {
                                    res.json({ status: 0, message: dictionnary_1.mail[2].data });
                                }
                                else {
                                    res.json({ status: 1, message: dictionnary_1.mail[10].data });
                                }
                                return [2 /*return*/];
                            });
                        });
                    });
                }
                else {
                    res.json({ status: 1, message: dictionnary_1.mail[10].data });
                }
            }
        });
    };
    //asks if token is in the resetPassword queue
    module.exports.checkResetPasswordToken = function (token, language, res) {
        var dictionnary = require('../files/json/translation/' + language + '.json');
        for (var _i = 0, resetPasswordQueue_1 = resetPasswordQueue; _i < resetPasswordQueue_1.length; _i++) {
            var line = resetPasswordQueue_1[_i];
            if (line.token === token) {
                res.json({ status: 1, message: dictionnary.mail[4].data });
                return 1;
            }
        }
        res.json({ status: 0, message: dictionnary.mail[5].data });
        return 0;
    };
    //resets the password of the account linked to the email, himself linked to the token
    module.exports.resetPassword = function (token, password, language, con, res) {
        for (var _i = 0, resetPasswordQueue_2 = resetPasswordQueue; _i < resetPasswordQueue_2.length; _i++) {
            var line = resetPasswordQueue_2[_i];
            if (line.token === token) {
                con.query('UPDATE users SET password = ? WHERE email = ?', [ash(password), line.email], function (err) {
                    if (err) {
                        throw err;
                    }
                    else {
                        var dictionnary = require('../files/json/translation/' + language + '.json');
                        clearResetPasswordQueue(token);
                        res.json({ status: 1, message: dictionnary.mail[11].data });
                    }
                });
            }
        }
    };
    //ash function for passwords
    var ash = function (str) { return crypto.createHash('sha256')
        .update(str, 'utf-8')
        .digest('hex'); };
    //generates token by stringing a random number
    function generateToken() {
        return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    }
    //clears creatingAccount queue,
    //single line including token if token or each line including email if email
    function clearCreatingAccountQueue(token, email) {
        if (email === void 0) { email = ''; }
        for (var i = 0; i < creatingAccountQueue.length; i++) {
            if (!email) {
                if (creatingAccountQueue[i].token === token) {
                    creatingAccountQueue.splice(i, 1);
                }
            }
            else {
                if (creatingAccountQueue[i].email === email) {
                    creatingAccountQueue.splice(i, 1);
                }
            }
        }
    }
    //clears resetPassword queue,
    //single line including token if token or each line including email if email
    function clearResetPasswordQueue(token, email) {
        if (email === void 0) { email = ''; }
        for (var i = 0; i < resetPasswordQueue.length; i++) {
            if (!email) {
                if (resetPasswordQueue[i].token === token) {
                    resetPasswordQueue.splice(i, 1);
                }
            }
            else {
                if (resetPasswordQueue[i].email === email) {
                    resetPasswordQueue.splice(i, 1);
                }
            }
        }
    }
})(account = exports.account || (exports.account = {}));
