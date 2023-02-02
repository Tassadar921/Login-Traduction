import { Request, Response } from "express-serve-static-core";
import { languages } from "./languages";

module languagesRouting {
    export function init(app : any) {
        app.get('/languages/list', async function(req : Request, res : Response) {
            await languages.getLanguagesList(res);
        });
        app.get('/languages/:language', async function(req : Request, res : Response) {
            await languages.getLanguagesOf(req.params.language, res);
        });

        console.log('Languages routing initialized');
    }
}

export default languagesRouting;