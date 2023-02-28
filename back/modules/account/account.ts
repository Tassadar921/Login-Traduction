// import * as nodemailer from 'nodemailer';
// import * as crypto from 'crypto';
// import * as edgedb from 'edgedb';
// import { accountRequest } from './accountRequest';
//
// export module account {
//     const client = edgedb.createClient({});
//
//     //init of the mail sender
//     const transporter = nodemailer.createTransport({
//         service: process.env.EMAIL_SERVICE,
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });
//
//     //mail options of subject, text and receiver
//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: '',
//         subject: '',
//         text: ''
//     };
//
//     //asks if an account containing username or email is in db, priority to username
//     export function userExists(username, email, res) {
//         accountRequest.checkUser(username, email, client);
//     };
//
//     //sends the creating account email, containing a unique token, effective for 5 minutes,
//     // temporary saving datas in the signUp queue
//     module.exports.mailCreateAccount = function (username, password, email, language, res) {
//         const dictionnary = require('../files/json/translation/' + language + '.json');
//         const token = generateToken();
//         clearCreatingAccountQueue('', email);
//         creatingAccountQueue.push({token, username, password, email});
//         setTimeout(clearCreatingAccountQueue, 300000, token);
//
//         mailOptions.to = email;
//         mailOptions.subject = dictionnary.mail[0].data;
//         mailOptions.text = dictionnary.mail[1].data.replace('username', username)
//             + urlFront
//             + 'conf-account?token='
//             + token;
//
//         transporter.sendMail(mailOptions, async function (error) {
//             if (error) {
//                 res.json({status: 0, message: dictionnary.mail[2].data});
//             } else {
//                 res.json({status: 1, message: dictionnary.mail[3].data});
//             }
//         });
//     };
//
//     //asks if token is in the signUp queue
//     module.exports.checkSignUpToken = function (token, language, res) {
//         const dictionnary = require('../files/json/translation/' + language + '.json');
//         for (const line of creatingAccountQueue) {
//             if (line.token === token) {
//                 res.json({status: 1, message: dictionnary.mail[4].data});
//                 return 1;
//             }
//         }
//         res.json({status: 0, message: dictionnary.mail[5].data});
//         return 0;
//     };
//
//     //creates the account with datas in the queue linked to token
//     module.exports.createAccount = function (token, language, con, res){
//         const dictionnary = require('../files/json/translation/' + language + '.json');
//         for(const line of creatingAccountQueue){
//             if(line.token===token){
//                 con.query('INSERT INTO users (username, password, email) VALUES (?,?,?)', [line.username, ash(line.password), line.email], (err) => {
//                     if(err){
//                         throw err;
//                     }else{
//                         const username = line.username;
//                         clearCreatingAccountQueue(line.token);
//                         res.json({status: 1, message: dictionnary.server[2].data, username: username});
//                     }
//                 });
//             }
//         }
//     }
//
//     //signIn, identifier can be either username or email
//     module.exports.signIn = function (identifier, password, language, con, res) {
//         const dictionnary = require('../files/json/translation/' + language + '.json');
//         con.query('SELECT username FROM users WHERE (username = ? OR email = ?)', [identifier, identifier], (e,r)=> {
//            if(e){
//                throw e;
//            }else{
//                if(!r.length){
//                    res.json({status: 0, message: dictionnary.mail[6].data});
//                }else{
//                    con.query('SELECT username FROM users WHERE (username = ? OR email = ?) AND password = ?', [identifier, identifier, ash(password)], (er,re)=>{
//                       if(er){
//                           throw er;
//                       }else{
//                           if(re.length){
//                               res.json({status: 1, message: '', username: re[0].username});
//                           }else{
//                               res.json({status: 0, message: dictionnary.mail[7].data});
//                           }
//                       }
//                    });
//                }
//            }
//         });
//     }
//
//     //sends an email containing a unique token to reset the password, effective for 5 minutes
//     //temporary linking the token and email in the resetPassword queue
//     module.exports.mailResetPassword = function (email, language, con, res){
//         con.query('SELECT email FROM users WHERE email = ?', email, (e, r) => {
//             if(e){
//                 throw e;
//             }else{
//                 const dictionnary = require('../files/json/translation/' + language + '.json');
//                 if(r.length){
//                     const token = generateToken();
//                     clearResetPasswordQueue('', email);
//                     resetPasswordQueue.push({token, email});
//                     setTimeout(clearResetPasswordQueue, 300000, token);
//                     mailOptions.to=email;
//                     mailOptions.subject=dictionnary.mail[8].data;
//                     mailOptions.text = dictionnary.mail[9].data
//                         + urlFront
//                         + 'reset-password?token='
//                         + token;
//                     transporter.sendMail(mailOptions, async function (error) {
//                         if (error) {
//                             res.json({status: 0, message: dictionnary.mail[2].data});
//                         } else {
//                             res.json({status: 1, message: dictionnary.mail[10].data});
//                         }
//                     });
//                 }else{
//                     res.json({status: 1, message: dictionnary.mail[10].data});
//                 }
//             }
//         });
//     }
//
//     //asks if token is in the resetPassword queue
//     module.exports.checkResetPasswordToken = function (token, language, res) {
//         const dictionnary = require('../files/json/translation/' + language + '.json');
//         for (const line of resetPasswordQueue) {
//             if (line.token === token) {
//                 res.json({status: 1, message: dictionnary.mail[4].data});
//                 return 1;
//             }
//         }
//         res.json({status: 0, message: dictionnary.mail[5].data});
//         return 0;
//     };
//
//     //resets the password of the account linked to the email, himself linked to the token
//     module.exports.resetPassword = function (token, password, language, con, res){
//         for(const line of resetPasswordQueue) {
//             if (line.token === token) {
//                 con.query('UPDATE users SET password = ? WHERE email = ?', [ash(password), line.email], (err) => {
//                     if (err) {
//                         throw err;
//                     } else {
//                         const dictionnary = require('../files/json/translation/' + language + '.json');
//                         clearResetPasswordQueue(token);
//                         res.json({status: 1, message:dictionnary.mail[11].data});
//                     }
//                 });
//             }
//         }
//     }
//
//     //ash function for passwords
//     const ash = (str : string) => crypto.createHash('sha256')
//     .update(str, 'utf-8')
//     .digest('hex');
//
//     //generates token by stringing a random number
//     function generateToken() {
//         return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
//     }
//
//     //clears creatingAccount queue,
//     //single line including token if token or each line including email if email
//     function clearCreatingAccountQueue(token : string, email='') {
//         for (let i = 0; i < creatingAccountQueue.length; i++) {
//             if(!email) {
//                 if (creatingAccountQueue[i].token === token) {
//                     creatingAccountQueue.splice(i, 1);
//                 }
//             }else{
//                 if (creatingAccountQueue[i].email === email) {
//                     creatingAccountQueue.splice(i, 1);
//                 }
//             }
//         }
//     }
//
//     //clears resetPassword queue,
//     //single line including token if token or each line including email if email
//     function clearResetPasswordQueue(token, email='') {
//         for (let i = 0; i < resetPasswordQueue.length; i++) {
//             if(!email) {
//                 if (resetPasswordQueue[i].token === token) {
//                     resetPasswordQueue.splice(i, 1);
//                 }
//             }else{
//                 if (resetPasswordQueue[i].email === email) {
//                     resetPasswordQueue.splice(i, 1);
//                 }
//             }
//         }
//     }
//
// }