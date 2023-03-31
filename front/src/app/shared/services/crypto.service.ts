import { Injectable } from '@angular/core';
import * as forge from "node-forge";
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(
    private requestService: RequestService
  ) {}

  //encrypts value with sha256
  public sha256(valueToEncrypt: string): string {
    return forge.md.sha256.create().update(valueToEncrypt).digest().toHex();
  }
}
