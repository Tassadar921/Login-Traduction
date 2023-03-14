import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-default-menu-item',
  templateUrl: './default-menu-item.component.html',
  styleUrls: ['./default-menu-item.component.scss'],
})
export class DefaultMenuItemComponent implements OnInit {

  @Input() menuItem: any = {};

  constructor() { }

  ngOnInit() {}

}
