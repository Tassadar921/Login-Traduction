//----------------------------------------Languages----------------------------------------
//Version 1.0.0 
//This class is used to manage the transfer of languages to the front
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { Response } from "express";

export class Languages{
    constructor() {}
    //sends the json index of languages
    async getLanguagesList(res : Response){
        //@ts-ignore
        const languagesList = await import('@files/json/languages/languagesList.json', {assert: {type: 'json'}});
        await res.json(languagesList.default.data);
        return;
    }

    //sends the json of the language id selectedLanguage
    async getDictionary (language : string, res : Response) {
        const languagesList = await import('@files/json/languages/languagesList.json', {assert: {type: 'json'}});
        if(!languagesList.default.data.find((lang : any) => lang.id === language)){
            await res.json({status: 0});
            return;
        }else {
            const translation = await import('./files/json/languages/' + language + '/' + language + '_front.json', {assert: {type: 'json'}});
            await res.json(translation.default);
            return;
        }
    }
}