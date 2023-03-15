import { Injectable } from '@angular/core';
import * as forge from "node-forge";
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private publicKey: string = '';

  constructor(
    private requestService: RequestService
  ) {}

  //rsa public key getter
  public getPublicKey(): string {
    return this.publicKey;
  }

  //setter of rsa public key from server
  public async setRsaPublicKey():Promise<void>{
    this.publicKey = Object(await this.requestService.getPublicKey()).publicKey;
  }

  //encrypts value with rsa public key
  public rsaEncryptWithPublicKey(valueToEncrypt: string): string {
    const rsa = forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt, 'RSA-OAEP'));
  }

  //encrypts value with sha256
  public sha256(valueToEncrypt: string): string {
    return forge.md.sha256.create().update(valueToEncrypt).digest().toHex();
  }
}
