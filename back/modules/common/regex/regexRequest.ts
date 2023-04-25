//----------------------------------------regexRequest----------------------------------------
//Version 1.0.0 
//This module contains all the regex used in the project
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

export module regexRequest {
    //checks if the sessionToken
    export function checkRegexSessionToken(sessionToken: string, sessionTokenLength : number): boolean {
        const regex = new RegExp('^[A-Za-z0-9]{' + sessionTokenLength + '}$');
        return (regex).test(sessionToken);
    }

    //checks if the urlToken format is valid
    export function checkRegexUrlToken(urlToken: string, urlTokenLength : number): boolean {
        const regex = new RegExp('^[A-Za-z0-9]{' + urlTokenLength + '}$');

        console.log(regex);
        console.log(urlToken);

        return (regex).test(urlToken);
    }

    //checks if the username format is valid
    export function checkRegexUsername(username: string): boolean {
        return (/^[A-Za-zÀ-ÖØ-öø-ÿ0-9_\-]{3,20}$/).test(username);
    }

    //checks if the email format is valid
    export function checkRegexEmail(email: string): boolean {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);
    }

    //checks if the password format is valid
    export function checkRegexPassword(password: string): boolean {
        return (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&\.\-_])[A-Za-z\d@$!%*?&\.\-_]{8,}$/).test(password);
    }

    export function checkRegexUUID(uuid : string) {
        return (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/).test(uuid);
    }
}

export default regexRequest;