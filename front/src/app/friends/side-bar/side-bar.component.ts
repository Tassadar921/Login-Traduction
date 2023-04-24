import { Component, OnInit } from '@angular/core';
import { LanguageService } from "../../shared/services/language.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {

  constructor(
    public languageService: LanguageService,
  ) { }

  ngOnInit() {}

}
