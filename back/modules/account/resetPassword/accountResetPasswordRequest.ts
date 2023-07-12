//----------------------------------------Notification----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountResetPassword.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 09/07/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//--------------------------------------------------------------------------------------------

import { prisma } from "../../common/prisma/prismaClient";

module accountResetPasswordRequest {
    export async function getUsernameByEmail(email: string) {
        return await prisma.user.findFirst({
            select: {
                username: true
            },
            where: {
                email: email
            }
        });
    }

    export async function deleteResetPasswordByEmail(email: string) {
        return await prisma.user_In_Reset_Password.deleteMany({
            where: {
                email: email
            }
        });
    }

    export async function checkUrlToken(urlToken: string) {
        return prisma.user_In_Reset_Password.findFirst({
            select: {
                urlToken: true
            },
            where: {
                urlToken: urlToken
            }
        });
    }

    export async function getEmailByUrlToken(urlToken: string) {
        return prisma.user_In_Reset_Password.findFirst({
            select: {
                email: true
            },
            where: {
                urlToken: urlToken
            }
        });
    }

    export async function deleteResetPasswordByUrlToken(urlToken: string) {
        return await prisma.user_In_Reset_Password.deleteMany({
            where: {
                urlToken: urlToken
            }
        });
    }

    export async function createResetPassword(urlToken: string, email: string) {
        return await prisma.user_In_Reset_Password.create({
            data: {
                urlToken: urlToken,
                email: email
            }
        });
    }

    export async function resetPassword(email: string, password: string) {
        return await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: password
            }
        });
    }
}

export default accountResetPasswordRequest;