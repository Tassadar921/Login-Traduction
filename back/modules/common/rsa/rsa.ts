import {PythonShell} from 'python-shell';

module rsa{

    let publicKey : number;
    let privateKey : number;
    export function init(){

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: 'modules/common/rsa/python',
            args: []
        };

// @ts-ignore
        PythonShell.run('rsaKeysGeneration.py', options).then((data)=>{
            console.log(JSON.parse(data[0]));
            publicKey = JSON.parse(data[0]).publicKey;
            privateKey = JSON.parse(data[0]).privateKey;
        });
    }

}

export default rsa;