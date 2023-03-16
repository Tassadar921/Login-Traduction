//----------------------------------------regexRequest----------------------------------------
//Version 1.0.0 
//This module contains all the regex used in the project
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

export module regexRequest {
    let urlTokenLength: number;
    let sessionTokenLength: number;

    export function initRegexRequest(){
        sessionTokenLength = parseInt(process.env.SESSION_TOKEN_LENGTH!);
        urlTokenLength = parseInt(process.env.URL_TOKEN_LENGTH!);
    }

    //checks if the sessionToken
    export function checkRegexSessionToken(sessionToken: string): boolean {
        const regex = new RegExp('^[A-Za-z0-9]{' + sessionTokenLength + '}$');
        return (regex).test(sessionToken);
    }

    //checks if the urlToken is valid
    export function checkRegexUrlToken(urlToken: string): boolean {
        const regex = new RegExp('/^[A-Za-z0-9]{' + urlTokenLength + '}$/');

        return (regex).test(urlToken);
    }

    //checks if the username is valid
    export function checkRegexUsername(username: string): boolean {
        return (/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_\-]{3,20}$/).test(username);
    }

    //checks if the email is valid
    export function checkRegexEmail(email: string): boolean {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);
    }

    //checks if the password is valid
    export function checkRegexPassword(password: string): boolean {
        return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&\.\-_])[A-Za-z\d@$!%*?&\.\-_]{8,}$/).test(password);
    }
}

export default regexRequest;