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
    
    public async mailCreateAccountCreateUrlToken(username : string, password : string, email : string, language : string, res : Response) {
        const result0 : any[] = await accountRequest.checkUser(username, email, this.client);

        if (result0.length > 0) {
            res.json({status: 0});
        }

        let result2 : any[] = await accountRequest.checkCreateAccountUrlTokenByEmail(email, this.client);

        switch(result2.length) {
            case 0:
                break;
            default:
                await accountRequest.deleteCreateAccountUrlToken(result2[0].urlToken, this.client);
            break;
        }
        
        let urlToken = this.generateToken(this.urlTokenLength);
        let result3 : any[] = await accountRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        while (result3.length > 0) {
            urlToken = this.generateToken(this.urlTokenLength);
            result3 = await accountRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        }

        await accountRequest.createCreateAccountUrlToken(urlToken, username, email, password, this.client);
    
        setTimeout(this.mailDeleteUrlToken, 600000, urlToken);

        const languageFile = await import('./files/json/languages/' + language + '/'+ language+'_back.json', {assert: {type: 'json'}})
    
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
        const result : [{ username : string , email : string, password : string }] | any = await accountRequest.checkCreateAccountUrlTokenByUrlToken(urlToken, this.client);
        if (result.length > 0) {
            await accountRequest.deleteCreateAccountUrlToken(urlToken, this.client);
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

    //sends an email containing a unique token to reset the password, effective for 5 minutes
    //temporary linking the token and email in the resetPassword queue
    public async mailResetPasswordCreateUrlToken (email : string, language : string, res : Response){
        const result0 : any[] = await accountRequest.checkUser('', email, this.client);

        if (result0.length > 0) {
            res.json({status: 0});
        }

        let result2 : any[] = await accountRequest.checkResetPasswordUrlTokenByEmail(email, this.client);

        switch(result2.length) {
            case 0:
                break;
            default:
                await accountRequest.deleteResetPasswordUrlToken(result2[0].urlToken, this.client);
            break;
        }
        
        let urlToken = this.generateToken(this.urlTokenLength);
        let result3 : any[] = await accountRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);
        while (result3.length > 0) {
            urlToken = this.generateToken(this.urlTokenLength);
            result3 = await accountRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);
        }

        await accountRequest.createResetPasswordUrlToken(urlToken, email, this.client);
    
        setTimeout(this.mailResetPasswordDeleteUrlToken, 600000, urlToken);

        const languageFile = await import('./files/json/languages/' + language + '/'+ language+'_back.json', {assert: {type: 'json'}})
    
        this.mailOptions.to = email;
        this.mailOptions.subject = languageFile.mail[0].data;
        this.mailOptions.text = languageFile.mail[1].data.replace('username', result0[0].username)
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
    }
    //resets the password of the account linked to the email, himself linked to the token
    public async resetPassword(urlToken, password, res){
        const result : [{ username : string , email : string, password : string }] | any = await accountRequest.checkResetPasswordUrlTokenByUrlToken(urlToken, this.client);

        if (result.length > 0) {
            await accountRequest.deleteResetPasswordUrlToken(urlToken, this.client);
            await accountRequest.resetPassword(result[0].email, password, this.client);
            res.json({status: 1});
        } else {
            res.json({status: 0});
        }
    }

    //sends an email containing a unique token to create the account, effective for 10 minutes
    private async mailDeleteUrlToken(urlToken) {
        await accountRequest.deleteCreateAccountUrlToken(urlToken, this.client);
    }

    //sends an email containing a unique token to reset the password, effective for 10 minutes
    private async mailResetPasswordDeleteUrlToken(urlToken) {
        await accountRequest.deleteResetPasswordUrlToken(urlToken, this.client);
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