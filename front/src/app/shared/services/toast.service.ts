import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController
  ) {}

  public async displayToast(message: string, position: "top"|"bottom"|"middle", duration: number = 3000): Promise<void> {
      const toast = await this.toastController.create({
        message,
        duration,
        position,
        cssClass: 'toast'
      });
      await toast.present();
    }
}
