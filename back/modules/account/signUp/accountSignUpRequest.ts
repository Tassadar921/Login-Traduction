//----------------------------------------SignUp----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountNotification.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 09/07/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//--------------------------------------------------------------------------------------

import { prisma } from "../../common/prisma/prismaClient";

module accountBasicRequest {
    export async function deleteTokenByToken(token: string) {
        return await prisma.user_In_Creation.deleteMany({
            where: {
                urlToken: token
            }
        })
    }
    export async function getUsernameAndEmailByUsernameAndEmail(username: string, email: string) {
        return await prisma.user.findFirst({
            select: {
                username: true,
                email: true
            },
            where: {
                OR: [
                    {
                        username: username
                    },
                    {
                        email: email
                    }]
            }
        });
    }

    export async function deleteTokenByEmail(email: string) {
        return await prisma.user_In_Creation.deleteMany({
            where: {
                email: email
            }
        })
    }

    export async function deleteUserCreationByUrlToken(urlToken: string) {
        return await prisma.user_In_Creation.deleteMany({
            where: {
                urlToken: urlToken
            }
        })
    }

    export async function checkUrlToken(urlToken: string) {
        return prisma.user_In_Creation.findFirst({
            select: {
                urlToken: true
            },
            where: {
                urlToken: urlToken
            }
        });
    }

    export async function checkSessionToken(sessionsToken: string) {
        return prisma.user.findFirst({
            select: {
                sessionToken: true
            },
            where: {
                sessionToken: sessionsToken
            }
        });
    }

    export async function createUser(username: string, email: string, password: string, token: string) {
        return await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password,
                sessionToken: token
            },
        });
    }

    export async function getUsernameAndEmailAndPasswordByUrlToken(urlToken: string) {
        return await prisma.user_In_Creation.findUnique({
            where: {
                urlToken: urlToken
            }
        });
    }

    export async function createUserInCreation(urlToken: string, username: string, email: string, password: string) {
        return await prisma.user_In_Creation.create({
            data: {
                urlToken: urlToken,
                username: username,
                email: email,
                password: password
            },
        });
    }
}

export default accountBasicRequest;