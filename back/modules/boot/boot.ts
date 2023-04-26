//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This module launch all the possible script needed at the start of the server
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { ResetTables } from "./resetTables/resetTables";

module boot {
    export async function start() {
        const resetTables : ResetTables = new ResetTables();

        await resetTables.startReset();
    }

}

export default boot;