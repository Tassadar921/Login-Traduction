//----------------------------------------SignIn----------------------------------------
//Version 1.0.0 
//This module manage the request to the database for accountSignIn.ts
//Version log :
//1.0.0 - 15/03/2023 - Iémélian RAMBEAU - Creation of the first version
//1.1.0 - 09/07/2023 - Iémélian RAMBEAU - Going from edgeDB to Prisma
//--------------------------------------------------------------------------------------

import { prisma } from "../../common/prisma/prismaClient";

module accountLoginRequest {
    export async function getUsernameByPasswordAndIdentifier(identifier : string, password : string) {
        return await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username: identifier,
                        password: password
                    },
                    {
                        email: identifier,
                        password: password
                    }
                ]
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

    export async function getUserByTokenAndUsername(username : string, token : string) {
        return prisma.user.findFirst({
            where: {
                username: username,
                sessionToken: token
            }
        });
    }

    export async function getPermissionByUsername(username : string) {
        return prisma.user.findMany({
            select: {
                permission: true
            },
            where: {
                username: username
            }
        });
    }

    export async function updateUserToken(username : string, token : string) {
        prisma.user.update({
            where: {
                username: username
            },
            data: {
                sessionToken: token
            }
        });
    }
}

export default accountLoginRequest;