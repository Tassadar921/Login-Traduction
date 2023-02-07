import { Response } from "express";

export class Languages{
    constructor() {}
    //sends the json index of languages
    async getLanguagesList(res : Response){
        // @ts-ignore
        const languagesList = await import('@files/json/languages/languagesList.json', {assert: {type: 'json'}});
        await res.json(languagesList.default.data);
        return;
    }

    //sends the json of the language id selectedLanguage
    async getDictionary (language : string, res : Response) {
        // @ts-ignore
        const translation = await import('./files/json/languages/' + language + '/' + language + '_front.json', {assert: {type: 'json'}});
        await res.json(translation.default);
        return;
    }
}