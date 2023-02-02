import { Response } from "express";

//sends the json index of languages
export function getLanguagesList(res : Response){
    const index = require('../files/json/translation/index.json');
    res.json({list: index});
}

//sends the json of the language id selectedLanguage
export function getLanguagesOf (language : string, res : Response) {
    const translation = require('../files/json/translation/' + language + '.json');
    res.json({list: translation});
}