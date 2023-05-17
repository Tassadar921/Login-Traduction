import {Component, Input, OnInit} from '@angular/core';
import {LanguageService} from '../../../../services/language.service';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
})
export class ProfilePopoverComponent implements OnInit {

  @Input() public async signOut(): Promise <void> {};

  constructor(
    public languageService: LanguageService,
  ) { }

  ngOnInit() {}

}
