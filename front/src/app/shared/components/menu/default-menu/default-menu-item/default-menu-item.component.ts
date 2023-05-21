import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-default-menu-item',
  templateUrl: './default-menu-item.component.html',
  styleUrls: ['./default-menu-item.component.scss'],
})
export class DefaultMenuItemComponent implements OnInit {

  @Input() menuItem: any = {};

  constructor(
    public router: Router,
    public navController: NavController
  ) { }

  ngOnInit(): void {}
}
