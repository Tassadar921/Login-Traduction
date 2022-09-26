import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController
  ) { }

  async presentToast(message, duration, position) {
    const toast = await this.toastController.create({
      message,
      duration,
      position
    });
    await toast.present();
  };
}
