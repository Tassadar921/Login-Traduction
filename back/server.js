const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const cors = require('cors');
const mysql = require('mysql');

const session = require('express-session')({
    secret: 'eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());
app.use(session);

const languages = require('./modules/languages.js');
const account = require('./modules/account.js');

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    session.cookie.secure = true;
}

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'oc'
});

function preventDisconnect() {
    con.connect(err => {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(preventDisconnect, 5000);
        } else {
            console.log('Connected to db');

            app.get('/getLanguagesList', function (req, res) {
                languages.getLanguagesList(res);
            });

            app.post('/getTranslation', function (req, res) {
                languages.getTranslation(req.body.language, res);
            });

            app.post('/userExists', function (req, res) {
                account.userExists(req.body.username, req.body.email, req.body.language, con, res);
            });

            app.post('/mailCreateAccount', function (req, res) {
                account.mailCreateAccount(req.body.username, req.body.password, req.body.email, req.body.language, res);
            });

            app.post('/checkSignUpToken', function (req, res) {
                account.checkSignUpToken(req.body.token, req.body.language, res);
            });

            app.post('/createAccount', function (req, res) {
                account.createAccount(req.body.token, req.body.language, con, res);
            });

            app.post('/signIn', function (req, res) {
                account.signIn(req.body.identifier, req.body.password, req.body.language, con, res);
            });

            app.post('/mailResetPassword', function (req, res) {
                account.mailResetPassword(req.body.email, req.body.language, con, res);
            });

            app.post('/checkResetPasswordToken', function (req, res) {
                account.checkResetPasswordToken(req.body.token, req.body.language, res);
            });

            app.post('/resetPassword', function (req, res) {
                account.resetPassword(req.body.token, req.body.password, req.body.language, con, res);
            });
        }
    });
}

preventDisconnect();

if (app.listen(process.env.PORT || 8080)) {
    console.log('Serveur lancé sur le port 8080');
}
