import * as nodemailer from 'nodemailer';
import { Response } from 'express';
import { Client, createClient } from 'edgedb';
import { accountRequest } from './accountRequest';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class Account {
    private client : Client;
    private transporter : nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private mailOptions: { from: string | undefined; to: string; subject: string; text: string; }
    private urlTokenLength : number;
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

        this.urlTokenLength = parseInt(process.env.URL_TOKEN_LENGTH!);
        this.tokenLength = parseInt(process.env.TOKEN_LENGTH!);
    }

    /*
    ------------------------------------------A SUPPRIMER------------------------------------------
    //asks if an account containing username or email is in db, priority to username
    public async userExists(username, email, res) {
        const result : any[] = await accountRequest.checkUser(username, email, this.client);
        if (result.length > 0) {
            res.json({status : 0});
        }
        res.json({status: 1});
    };
    */
    
    public async mailCreateUrlToken(username : string, password : string, email : string, language : string, res : Response) {
        const result0 : any[] = await accountRequest.checkUrlTokenByEmail(email, this.client);

        if (result0.length > 0) {
            res.json({status: 0});
        }

        let result1 : any[] = await accountRequest.checkUrlTokenByEmail(email, this.client);

        switch(result1.length) {
            case 0:
                break;
            case 1:
                await accountRequest.deleteUrlToken(result1[0].urlToken, this.client);
            break;
        }
        
        let urlToken = this.generateToken(this.urlTokenLength);
        let result2 : any[] = await accountRequest.checkUrlTokenByUrlToken(urlToken, this.client);
        while (result2.length > 0) {
            urlToken = this.generateToken(this.urlTokenLength);
            result2 = await accountRequest.checkUrlTokenByUrlToken(urlToken, this.client);
        }

        await accountRequest.createUrlToken(urlToken, username, email, password, this.client);
    
        setTimeout(this.mailDeleteUrlToken, 600000, urlToken);

        const languageFile = await import('./files/json/languages/' + language + '.json', {assert: {type: 'json'}})
    
        this.mailOptions.to = email;
        this.mailOptions.subject = languageFile.mail[0].data;
        this.mailOptions.text = languageFile.mail[1].data.replace('username', username)
            + process.env.URL_FRONT
            + 'conf-account?urlToken='
            + urlToken;
    
        //sends an email containing a unique token to delete the account, effective for 10 minutes

        this.transporter.sendMail(this.mailOptions, async function (error) {
            if (error) {
                res.json({status: -1});
            } else {
                res.json({status: 1});
            }
        });
    };

    //creates the account with datas in the queue linked to token
    public async createUser(urlToken : string, res : Response) {
        const result : [{ username : string , email : string, password : string }] | any = await accountRequest.checkUrlTokenByUrlToken(urlToken, this.client);
        if (result.length > 0) {
            await accountRequest.deleteUrlToken(urlToken, this.client);
            await accountRequest.createUser(result[0].username, result[0].email, result[0].password, "none", this.client);
            res.json({status: 1});
        } else {
            res.json({status: 0});
        }
    }

    //signIn, identifier can be either username or email
    public async signIn(identifier, password, res) {
        let result : [{ username : string, email : string }] | any;

        if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(identifier)) {
            result = await accountRequest.checkUserByEmail(identifier, password, this.client);
        }
        else if((/^[a-zA-Z][a-zA-Z0-9_]{3,29}$/).test(identifier)) {
            result = await accountRequest.checkUserByUsername(identifier, password, this.client);
        }
        else {
            res.json({status: -1});
        }

        if (result.length > 0) {
            let token = this.generateToken(this.tokenLength);
            let result1 : any[] = await accountRequest.checkToken(token, this.client);
            while (result1.length > 0) {
                token = this.generateToken(this.tokenLength);
                result1 = await accountRequest.checkToken(token, this.client);
            }

            await accountRequest.updateUserToken(result[0].username, token, this.client);

            res.json({status: 1, token: token, username: result[0].username});
        } else {
            res.json({status: 0});
        }
    }

    //checks if the token is valid for the user
    public async fastCheck(username, token, res) {
        const result : [{ username : string }] | any = await accountRequest.checkUserByToken(username, token, this.client);
        if (result.length == 1) {
            res.json({status: 1});
        } else {
            res.json({status: 0});
        }
    }

/*
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

    //sends an email containing a unique token to delete the account, effective for 5 minutes
    private async mailDeleteUrlToken(urlToken) {
        await accountRequest.deleteUrlToken(urlToken, this.client);
    }

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