//----------------------------------------Tables----------------------------------------
//Version 1.0.0 
//This class reset all the timouts in case they weren't able to be launched on the last use of the server
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import createClient, { Client } from "edgedb";
import { AccountSignUp } from "modules/account/signUp/accountSignUp";
import { AccountResetPassword } from "modules/account/resetPassword/accountResetPassword";
import resetTablesRequest from "./resetTablesRequest";
import logger from "modules/common/logger/logger";

export class ResetTables {
    private client : Client;
    private accountSignUp : AccountSignUp;
    private accountResetPassword: AccountResetPassword;

    constructor() {
        this.client = createClient({});
        this.accountSignUp = new AccountSignUp();
        this.accountResetPassword = new AccountResetPassword();
    }

    public async startReset(): Promise<void> {
        logger.logger.info('=========== RESETING ALL TABLES ===========');

        const tableUserCreation : any[] = await resetTablesRequest.getUrlTokenFromUserCreation(this.client);

        if(tableUserCreation !== undefined) {
            tableUserCreation.forEach(element => {
                this.accountSignUp.deleteUserCreation(element.urlToken);
            });
            logger.logger.info(tableUserCreation.length + ' urlToken(s) reseted from the mailUserCreationQueue')
        }

        logger.logger.info('----------- Reset of Reset_Password table done -----------')

        const tableResetPassword : any[] = await resetTablesRequest.getUrlTokenFromResetPassword(this.client);
        if(tableResetPassword !== undefined) {
            tableResetPassword.forEach(element => {
                this.accountResetPassword.deleteResetPassword(element.urlToken);
            });
            logger.logger.info('');
            logger.logger.info(tableResetPassword.length + ' urlToken(s) reseted from the mailResetPasswordQueue')
        }
        logger.logger.info('----------- Reset of User_Creation table done -----------')
        logger.logger.info('=========== RESETING ALL TABLES DONE ===========')
        return;
    }
}