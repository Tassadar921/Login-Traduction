import { Component, OnInit } from '@angular/core';
import {PagesService} from '../../services/pages.service';

@Component({
  selector: 'app-common-pages-system-footer',
  templateUrl: './common-pages-system-footer.component.html',
  styleUrls: ['./common-pages-system-footer.component.scss'],
})
export class CommonPagesSystemFooterComponent implements OnInit {

  constructor(
    public pagesService: PagesService
  ) {}

  ngOnInit(): void {}

}
