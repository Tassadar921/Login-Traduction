import createClient from "edgedb";
import { AccountSignUp } from "modules/account/signUp/accountSignUp";
import { AccountResetPassword } from "modules/account/resetPassword/accountResetPassword";
import resetTablesRequest from "./resetTablesRequest";

export class ResetTables {
    private client;
    private accountSignUp;
    accountResetPassword: AccountResetPassword;

    constructor() {
        this.client = createClient({});
        this.accountSignUp = new AccountSignUp();
        this.accountResetPassword = new AccountResetPassword();
    }

    public async startReset(): Promise<void> {
        console.log('');
        console.log('=========== RESETING ALL TABLES ===========');
        console.log('Reset of all the timeout in case they weren\'t able to be launched on the last use of the server.')

        const tableResetPassword = await resetTablesRequest.resetResetPassword(this.client);
        if(tableResetPassword !== undefined) {
            tableResetPassword.forEach(element => {
                this.accountSignUp.deleteUserCreation(element.urlToken);
            });
            console.log('');
            console.log(tableResetPassword.length + ' urlToken(s) reseted from the mailResetPasswordQueue')
        }
        console.log('----------- Reset of Reset_Password table done -----------')

        const tableUserCreation = await resetTablesRequest.resetUserCreation(this.client);
        if(tableUserCreation !== undefined) {
            tableUserCreation.forEach(element => {
                this.accountResetPassword.deleteResetPassword(element.urlToken);
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