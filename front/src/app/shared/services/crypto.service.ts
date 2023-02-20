import { Injectable } from '@angular/core';
import * as forge from "node-forge";
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  public publicKey: string = '';

  constructor(
    private requestService: RequestService
  ) {}

  public getPublicKey(): string {
    return this.publicKey;
  }

  public async setRsaPublicKey():Promise<void>{
    this.publicKey = Object(await this.requestService.getPublicKey()).publicKey;
  }
  public rsaEncryptWithPublicKey(valueToEncrypt: string): string {
    const rsa = forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt, 'RSA-OAEP'));
  }

  public sha256(valueToEncrypt: string): string {
    return forge.md.sha256.create().update(valueToEncrypt).digest().toHex();
  }
}
