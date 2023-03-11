import createClient from "edgedb";
import { AccountBasic } from "modules/account/basic/accountBasic";
import resetTablesRequest from "./resetTablesRequest";

export class ResetTables {
    private client;
    private accountBasic;

    constructor() {
        this.client = createClient({});
        this.accountBasic = new AccountBasic;
    }

    public async startReset(): Promise<void> {
        console.log('');
        console.log('=========== RESETING ALL TABLES ===========');
        console.log('Reset of all the timeout in case they weren\'t able to be launched on the last use of the server.')

        const tableResetPassword = await resetTablesRequest.resetResetPassword(this.client);
        if(tableResetPassword !== undefined) {
            tableResetPassword.forEach(element => {
                this.accountBasic.deleteMailResetPasswordQueueUrlToken(element.urlToken);
            });
            console.log('');
            console.log(tableResetPassword.length + ' urlToken(s) reseted from the mailResetPasswordQueue')
        }
        console.log('----------- Reset of Reset_Password table done -----------')

        const tableUserCreation = await resetTablesRequest.resetUserCreation(this.client);
        if(tableUserCreation !== undefined) {
            tableUserCreation.forEach(element => {
                this.accountBasic.deleteCreateAccountQueueUrlToken(element.urlToken);
            });
            console.log('');
            console.log(tableUserCreation.length + ' urlToken(s) reseted from the mailUserCreationQueue')
        }
        console.log('----------- Reset of User_Creation table done -----------')
        console.log('');
        console.log('=========== RESETING ALL TABLES DONE ===========')
        console.log('');
        return;
    }
}