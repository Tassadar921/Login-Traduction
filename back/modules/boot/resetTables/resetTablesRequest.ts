//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for resetTablesRequest.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 15/03/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//--------------------------------------------------------------------------------------

import { prisma } from "../../common/prisma/prismaClient";

module resetTablesRequest {
    export async function getUrlTokenFromResetPassword() {
        return await prisma.user_In_Reset_Password.findMany({
            select: {
                urlToken: true
            }
        });
    }

    export async function getUrlTokenFromUserCreation() {
        return await prisma.user_In_Creation.findMany({
            select: {
                urlToken: true
            }
        });
    }
}

export default resetTablesRequest;