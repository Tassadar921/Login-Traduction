import {createClient} from "edgedb";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {Client} from "edgedb";
import crypto from "node:crypto";

export class CommonAccount {

    public mailOptions: { from: string | undefined; to: string; subject: string; text: string;};
    public client: Client;
    public transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    public urlTokenLength: number;
    public sessionTokenLength: number;
    public urlTokenExpiration: number;
    constructor(){
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
        this.sessionTokenLength = parseInt(process.env.SESSION_TOKEN_LENGTH!);
        this.urlTokenExpiration = parseInt(process.env.URL_TOKEN_EXPIRATION!);
    }

    //hash a string with sha256
    public async hashSha256(data: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            hash.write(data);
            hash.on('readable', () => {
                const data = hash.read();
                if (data) {
                    const final = data.toString('hex');
                    resolve(final);
                } else {
                    reject('erreur random');
                }
            });
            hash.end();
        });
    }

    // generates token by stringing a random number of characters from a dictionary
    public generateToken(length: number): string {
        //edit the token allowed characters
        let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
        let token: string = '';
        for (let i = 0; i < length; i++) {
            let j = Math.floor(Math.random() * (alphabet.length - 1));
            token += alphabet[j];
        }
        return token;
    }
}