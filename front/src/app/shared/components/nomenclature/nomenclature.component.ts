import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-nomenclature',
  templateUrl: './nomenclature.component.html',
  styleUrls: ['./nomenclature.component.scss'],
})
export class NomenclatureComponent implements OnInit {

  @Input() data: string = '';
  @Input() modalName: string = '';

  constructor(
    public modalController: ModalController,
  ) {}

  ngOnInit() {}

}
