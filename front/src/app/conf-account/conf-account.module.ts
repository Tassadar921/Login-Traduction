import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfAccountPageRoutingModule } from './conf-account-routing.module';

import { ConfAccountPage } from './conf-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfAccountPageRoutingModule
  ],
  declarations: [ConfAccountPage]
})
export class ConfAccountPageModule {}
