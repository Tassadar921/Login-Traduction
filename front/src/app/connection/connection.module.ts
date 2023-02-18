import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionPageRoutingModule } from './connection-routing.module';

import { ConnectionPage } from './connection.page';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LanguageModule} from '../shared/components/language/language.module';
import {MoonBackgroundModule} from '../shared/components/moon-background/moon-background.module';
import {ForgotPasswordComponent} from './sign-in/forgot-password/forgot-password.component';
import {NomenclatureComponent} from './sign-up/nomenclature/nomenclature.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionPageRoutingModule,
    LanguageModule,
    MoonBackgroundModule
  ],
  declarations: [ConnectionPage, SignInComponent, SignUpComponent, ForgotPasswordComponent, NomenclatureComponent]
})
export class ConnectionPageModule {}
