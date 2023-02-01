//sends the json index of languages
export function getLanguagesList (res) {
    const index = require('../files/json/translation/index.json');
    res.json({list: index});
}

//sends the json of the language id selectedLanguage
export function getTranslation (language, res) {
    const translation = require('../files/json/translation/' + language + '.json');
    res.json({list: translation});
}