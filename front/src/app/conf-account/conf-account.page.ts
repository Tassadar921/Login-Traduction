import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conf-account',
  templateUrl: './conf-account.page.html',
  styleUrls: ['./conf-account.page.scss'],
})
export class ConfAccountPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
    });
  }

}
