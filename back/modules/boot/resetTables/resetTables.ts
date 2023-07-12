//----------------------------------------Tables----------------------------------------
//Version 1.0.0 
//This class reset all the timouts in case they weren't able to be launched on the last use of the server
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//--------------------------------------------------------------------------------------

import { AccountSignUp } from "../../account/signUp/accountSignUp";
import { AccountResetPassword } from "../../account/resetPassword/accountResetPassword";
import resetTablesRequest from "./resetTablesRequest";
import logger from "../../common/logger/logger";

export class ResetTables {
    private accountSignUp : AccountSignUp;
    private accountResetPassword: AccountResetPassword;

    constructor() {
        this.accountSignUp = new AccountSignUp();
        this.accountResetPassword = new AccountResetPassword();
    }

    public async startReset(): Promise<void> {
        logger.logger.info('=========== RESETING ALL TABLES ===========');

        const tableUrlsTokensUserCreation = await resetTablesRequest.getUrlTokenFromUserCreation();

        if(tableUrlsTokensUserCreation !== undefined) {
            tableUrlsTokensUserCreation.forEach(element => {
                this.accountSignUp.deleteUserCreation(element.urlToken);
            });
            logger.logger.info(tableUrlsTokensUserCreation.length + ' urlToken(s) reseted from the mailUserCreationQueue')
        }

        logger.logger.info('----------- Reset of Reset_Password table done -----------')

        const tableUrlsTokensResetPassword = await resetTablesRequest.getUrlTokenFromResetPassword();
        if(tableUrlsTokensResetPassword !== undefined) {
            tableUrlsTokensResetPassword.forEach(element => {
                this.accountResetPassword.deleteResetPassword(element.urlToken);
            });
            logger.logger.info('');
            logger.logger.info(tableUrlsTokensResetPassword.length + ' urlToken(s) reseted from the mailResetPasswordQueue')
        }
        logger.logger.info('----------- Reset of User_Creation table done -----------')
        logger.logger.info('=========== RESETING ALL TABLES DONE ===========')
        return;
    }
}