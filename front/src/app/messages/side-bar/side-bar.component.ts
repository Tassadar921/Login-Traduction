import { Component, OnInit } from '@angular/core';
import { LanguageService } from "../../shared/services/language.service";
import {PagesService} from '../../shared/services/pages.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {

  constructor(
    public languageService: LanguageService,
    public pagesService: PagesService,
  ) {}

  async ngOnInit(): Promise<void> {
    window.addEventListener(('resize'), async (): Promise<void> => {
      await this.pagesService.onChangeAndInit('Friends');
    });
    await this.pagesService.onChangeAndInit('Friends');
  }

}
