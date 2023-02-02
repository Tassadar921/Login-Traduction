import { Request, Response } from "express-serve-static-core";
import { languages } from "./languages";

export default languagesRouting;
module languagesRouting {
    export function init(app : any) {
        app.get('/languages/list', function(req : Request, res : Response) {
            languages.getLanguagesList(res);
        });
        app.get('/languages/:language', function(req : Request, res : Response) {
            languages.getLanguagesOf(req.params.language, res);
        });

        console.log('Languages routing initialized');
    }
}