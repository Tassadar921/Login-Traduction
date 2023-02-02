import { Response } from "express";

export module languages{
    //sends the json index of languages
    export async function getLanguagesList(res : Response){
        const languagesList = await import('../../files/json/translation/languagesList.json', {assert: {type: 'json'}})
        await res.json(languagesList.default);
        return;
    }

    //sends the json of the language id selectedLanguage
    export async function getDictionary (language : string, res : Response) {
        const translation = await import('../../files/json/translation/' + language + '.json', {assert: {type: 'json'}})
        await res.json({translation});
        return;
    }
}