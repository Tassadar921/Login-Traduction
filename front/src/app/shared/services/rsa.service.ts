import { Injectable } from '@angular/core';
import * as Forge from "node-forge";
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class RSAService {

  private publicKey: string = '';

  constructor(
    private requestService: RequestService
  ) {}

  public async setPublicKey():Promise<void>{
    this.publicKey = Object(await this.requestService.getPublicKey()).publicKey;
  }
  public encryptWithPublicKey(valueToEncrypt: string): string {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt, 'RSA-OAEP'));
  }
}
