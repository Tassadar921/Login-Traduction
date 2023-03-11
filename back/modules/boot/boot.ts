import { ResetTables } from "./resetTables/resetTables";

module boot {
    export async function start() {
        const resetTables = new ResetTables();

        await resetTables.startReset();
    }

}

export default boot;