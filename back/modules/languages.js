//sends the json index of languages
module.exports.getLanguagesList = function (res) {
    const index = require('../files/json/translation/index.json');
    res.json({list: index});
}

//sends the json of the language id selectedLanguage
module.exports.getTranslation = function (language, res) {
    const translation = require('../files/json/translation/' + language + '.json');
    res.json({list: translation});
}