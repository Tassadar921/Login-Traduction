import { Request, Response } from "express-serve-static-core";
import { getLanguagesList, getLanguagesOf } from "./languages";

export default languagesRouting;

module languagesRouting {
    export function init(app : any) {
        app.get('/languages/list', function(req : Request, res : Response) {
            getLanguagesList(res);
        });
        app.get('/languages/:language', function(req : Request, res : Response) {
            getLanguagesOf(req.params.language, res);
        });

        console.log('Languages routing initialized');
    }
}