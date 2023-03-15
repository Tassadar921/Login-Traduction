//----------------------------------------languagesRouting----------------------------------------
//Version 1.0.0 
//This module manage the routing for all the language module
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { Request, Response } from "express";
import { Languages } from "./languages";

module languagesRouting {
    export function init(app : any): void {
        const languages = new Languages();
        
        app.get('/languages/list', async function(req : Request, res : Response) {
            await languages.getLanguagesList(res);
        });
        app.get('/languages/:language', async function(req : Request, res : Response) {
            await languages.getDictionary(req.params.language, res);
        });

        console.log('Languages routing initialized');
        return;
    }
}

export default languagesRouting;