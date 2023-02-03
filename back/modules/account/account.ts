import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { Client, createClient } from 'edgedb';
import { accountRequest } from './accountRequest';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class Account {
    private client : Client;
    private transporter : nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private mailOptions: { from: string | undefined;to: string;subject: string;text: string; }
    private tokenLength : number;
    
    constructor() {
        this.client = createClient({});
    
        //init of the mail sender
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    
        //mail options of subject, text and receiver
        this.mailOptions = {
            from: process.env.EMAIL,
            to: '',
            subject: '',
            text: ''
        };

        this.tokenLength = parseInt(process.env.TOKEN_LENGTH!);
    }
    
    //asks if an account containing username or email is in db, priority to username
    public async userExists(username, email, res) {
        const result : any[] = await accountRequest.checkUser(username, email, this.client);
        if (result.length > 0) {
            res.json({status : 0});
        }
        res.json({status: 1});
    };
    
    public async mailCreateAccountUrlToken(username, password, email, language, res) {
        let result0 : any[] = await accountRequest.checkUrlTokenByEmail(email, this.client);

        switch(result0.length) {
            case 0:
                break;
            case 1:
                await accountRequest.deleteUrlToken(result0[0].urlToken, this.client);
            break;
        }
        
        let urlToken = this.generateToken(this.tokenLength);
        let result1 : any[] = await accountRequest.checkUrlTokenByUrlToken(urlToken, this.client);
        while (result1.length > 0) {
            urlToken = this.generateToken(this.tokenLength);
            result1 = await accountRequest.checkUrlTokenByUrlToken(urlToken, this.client);
        }
    
        setTimeout(this.mailDeleteAccountUrlToken, 600000, urlToken);

        const languageFile = await import('./files/json/languages/' + language + '.json', {assert: {type: 'json'}})
    
        this.mailOptions.to = email;
        this.mailOptions.subject = languageFile.mail[0].data;
        this.mailOptions.text = languageFile.mail[1].data.replace('username', username)
            + process.env.URL_FRONT
            + 'conf-account?urlToken='
            + urlToken;

        this.transporter.sendMail(this.mailOptions, async function (error) {
            if (error) {
                res.json({status: 0, message: languageFile.mail[2].data});
            } else {
                res.json({status: 1, message: languageFile.mail[3].data});
            }
        });
    };

    private async mailDeleteAccountUrlToken(urlToken) {
        await accountRequest.deleteUrlToken(urlToken, this.client);
    }

/*
    //creates the account with datas in the queue linked to token
    module.exports.createAccount = function (token, language, con, res){
        const dictionnary = require('../files/json/translation/' + language + '.json');
        for(const line of creatingAccountQueue){
            if(line.token===token){
                con.query('INSERT INTO users (username, password, email) VALUES (?,?,?)', [line.username, ash(line.password), line.email], (err) => {
                    if(err){
                        throw err;
                    }else{
                        const username = line.username;
                        clearCreatingAccountQueue(line.token);
                        res.json({status: 1, message: dictionnary.server[2].data, username: username});
                    }
                });
            }
        }
    }

    //signIn, identifier can be either username or email
    module.exports.signIn = function (identifier, password, language, con, res) {
        const dictionnary = require('../files/json/translation/' + language + '.json');
        con.query('SELECT username FROM users WHERE (username = ? OR email = ?)', [identifier, identifier], (e,r)=> {
           if(e){
               throw e;
           }else{
               if(!r.length){
                   res.json({status: 0, message: dictionnary.mail[6].data});
               }else{
                   con.query('SELECT username FROM users WHERE (username = ? OR email = ?) AND password = ?', [identifier, identifier, ash(password)], (er,re)=>{
                      if(er){
                          throw er;
                      }else{
                          if(re.length){
                              res.json({status: 1, message: '', username: re[0].username});
                          }else{
                              res.json({status: 0, message: dictionnary.mail[7].data});
                          }
                      }
                   });
               }
           }
        });
    }

    //sends an email containing a unique token to reset the password, effective for 5 minutes
    //temporary linking the token and email in the resetPassword queue
    module.exports.mailResetPassword = function (email, language, con, res){
        con.query('SELECT email FROM users WHERE email = ?', email, (e, r) => {
            if(e){
                throw e;
            }else{
                const dictionnary = require('../files/json/translation/' + language + '.json');
                if(r.length){
                    const token = generateToken();
                    clearResetPasswordQueue('', email);
                    resetPasswordQueue.push({token, email});
                    setTimeout(clearResetPasswordQueue, 300000, token);
                    mailOptions.to=email;
                    mailOptions.subject=dictionnary.mail[8].data;
                    mailOptions.text = dictionnary.mail[9].data
                        + urlFront
                        + 'reset-password?token='
                        + token;
                    transporter.sendMail(mailOptions, async function (error) {
                        if (error) {
                            res.json({status: 0, message: dictionnary.mail[2].data});
                        } else {
                            res.json({status: 1, message: dictionnary.mail[10].data});
                        }
                    });
                }else{
                    res.json({status: 1, message: dictionnary.mail[10].data});
                }
            }
        });
    }

    //asks if token is in the resetPassword queue
    module.exports.checkResetPasswordToken = function (token, language, res) {
        const dictionnary = require('../files/json/translation/' + language + '.json');
        for (const line of resetPasswordQueue) {
            if (line.token === token) {
                res.json({status: 1, message: dictionnary.mail[4].data});
                return 1;
            }
        }
        res.json({status: 0, message: dictionnary.mail[5].data});
        return 0;
    };

    //resets the password of the account linked to the email, himself linked to the token
    module.exports.resetPassword = function (token, password, language, con, res){
        for(const line of resetPasswordQueue) {
            if (line.token === token) {
                con.query('UPDATE users SET password = ? WHERE email = ?', [ash(password), line.email], (err) => {
                    if (err) {
                        throw err;
                    } else {
                        const dictionnary = require('../files/json/translation/' + language + '.json');
                        clearResetPasswordQueue(token);
                        res.json({status: 1, message:dictionnary.mail[11].data});
                    }
                });
            }
        }
    }
    */

    // generates token by stringing a random number of characters from a dictionnary
    private generateToken(length : number) {
        //edit the token allowed characters
        let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        let b : string[] = [];
        for (let i=0; i<length; i++) {
            let j = (Math.random() * (a.length-1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }
}