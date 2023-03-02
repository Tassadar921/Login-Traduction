import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-close-button',
  templateUrl: './modal-close-button.component.html',
  styleUrls: ['./modal-close-button.component.scss'],
})
export class ModalCloseButtonComponent implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {}

}
