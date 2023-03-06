import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-return-to-button',
  templateUrl: './return-to-button.component.html',
  styleUrls: ['./return-to-button.component.scss'],
})
export class ReturnToButtonComponent implements OnInit {

  @Input() link: string = '';

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {}

  public async goTo() {
    await this.router.navigateByUrl(this.link);
  }

}
