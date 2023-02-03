import { Response } from "express";

export class Languages{
    constructor() {
    }
    //sends the json index of languages
    async getLanguagesList(res : Response){
        console.log('ici');
        // @ts-ignore
        const languagesList = await import('@files/json/languages/languagesList.json', {assert: {type: 'json'}})
        await res.json(languagesList.data);
        return;
    }

    //sends the json of the language id selectedLanguage
    async getDictionary (language : string, res : Response) {
        console.log('là');
        // @ts-ignore
        const translation = await import('./files/json/languages/' + language + '.json', {assert: {type: 'json'}})
        console.log('là');
        await res.json(translation.default);
        return;
    }
}