import { Response } from "express";
// @ts-ignore
import languagesList from '../../files/json/translation/languagesList.json';

export module languages{
    //sends the json index of languages
    export async function getLanguagesList(res : Response){
        console.log(languagesList);
        await res.json(languagesList.data);
        return;
    }

    //sends the json of the language id selectedLanguage
    export async function getDictionary (language : string, res : Response) {
        // @ts-ignore
        const translation = await import('./src/files/json/translation/' + language + '.json', {assert: {type: 'json'}})
        await res.json(translation.default);
        return;
    }
}