import { Response } from "express";

export module languages{
    //sends the json index of languages
    export async function getLanguagesList(res : Response){
        const index = await import('../../files/json/translation/index.json', {assert: {type: 'json'}});
        res.json({list: index});
    }

    //sends the json of the language id selectedLanguage
    export async function getLanguagesOf (language : string, res : Response) {
        const translation = await import('../../files/json/translation/' + language + '.json', {assert: {type: 'json'}})
        res.json({list: translation});
    }
}