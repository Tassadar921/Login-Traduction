import { Injectable } from '@angular/core';
import * as Forge from "node-forge";

@Injectable({
  providedIn: 'root'
})
export class RSAService {

  public publicKey: string = '';

  constructor() {}

  public encryptWithPublicKey(valueToEncrypt: string): string {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt, 'RSA-OAEP'));
  }
}
