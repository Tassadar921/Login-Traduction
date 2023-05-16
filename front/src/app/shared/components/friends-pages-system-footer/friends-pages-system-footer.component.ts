import { Component, OnInit } from '@angular/core';
import {PagesService} from '../../services/pages.service';

@Component({
  selector: 'app-friends-pages-system-footer',
  templateUrl: './friends-pages-system-footer.component.html',
  styleUrls: ['./friends-pages-system-footer.component.scss'],
})
export class FriendsPagesSystemFooterComponent implements OnInit {

  constructor(
    public pagesService: PagesService
  ) {}

  ngOnInit(): void {}

}
