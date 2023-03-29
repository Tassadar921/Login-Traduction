import {PythonShell} from 'python-shell';

module rsa {

    let publicKey: number;
    let privateKey: number;

    export function init() {

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: 'modules/common/rsa/python',
            args: []
        };

// @ts-ignore
        PythonShell.run('rsaKeysGeneration.py', options).then((data) => {
            data = data[0].split(', PrivateKey');
            data[1] = 'PrivateKey' + data[1]
            publicKey = data[0];
            privateKey = data[1];
        });
    }

    export function getPublicKey() {
        return publicKey;
    }

    export function decrypt(cypherText: string) {
        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: 'modules/common/rsa/python',
            args: [{cypherText, privateKey}]
        };

        // @ts-ignore
        PythonShell.run('decrypt.py', options).then((data) => {
            console.log(data);
        });
    }
}


export default rsa;