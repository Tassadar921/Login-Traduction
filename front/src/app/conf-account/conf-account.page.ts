import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {RequestService} from '../shared/services/request.service';

@Component({
  selector: 'app-conf-account',
  templateUrl: './conf-account.page.html',
  styleUrls: ['./conf-account.page.scss'],
})
export class ConfAccountPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      const rtrn = await this.requestService.createAccount(Object(params).urlToken);
      if(Object(rtrn).status) {
        //account created => redirect + toast
      }else{
        //token deprecated or wrong => redirect connection + toast
      }
    });
  }
}
