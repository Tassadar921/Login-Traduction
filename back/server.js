import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as edgedb from 'edgedb';

import * as languages from './modules/languages.js';
import * as account from './modules/account.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:8100'}));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

// app.get('/getLanguagesList', async function (req, res) {
//     await languages.getLanguagesList(res);
// });
//
// app.post('/getTranslation', async function (req, res) {
//     await languages.getTranslation(req.body.language, res);
// });
//
// app.post('/userExists', function (req, res) {
//     account.userExists(req.body.username, req.body.email, req.body.language, res);
// });
//
// app.post('/mailCreateAccount', function (req, res) {
//     account.mailCreateAccount(req.body.username, req.body.password, req.body.email, req.body.language, res);
// });
//
// app.post('/checkSignUpToken', function (req, res) {
//     account.checkSignUpToken(req.body.token, req.body.language, res);
// });
//
// app.post('/createAccount', function (req, res) {
//     account.createAccount(req.body.token, req.body.language, res);
// });
//
// app.post('/signIn', function (req, res) {
//     account.signIn(req.body.identifier, req.body.password, req.body.language, res);
// });
//
// app.post('/mailResetPassword', function (req, res) {
//     account.mailResetPassword(req.body.email, req.body.language, con, res);
// });
//
// app.post('/checkResetPasswordToken', function (req, res) {
//     account.checkResetPasswordToken(req.body.token, req.body.language, res);
// });
//
// app.post('/resetPassword', function (req, res) {
//     account.resetPassword(req.body.token, req.body.password, req.body.language, con, res);
// });

const connection = edgedb.createClient({});
// console.log(await connection.querySingle(");
console.log(await connection.query("SELECT User {username, email, password}"));
// console.log(await connection.query("INSERT User {username := 'test', email := 'coucou@coucou', password := '123'}"));
console.log('finito');

if (app.listen(process.env.PORT || 8080)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log('    =============   PORT: 8080   =============');
}