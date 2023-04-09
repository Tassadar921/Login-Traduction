import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ConnectionPageRoutingModule} from './connection-routing.module';

import {ConnectionPage} from './connection.page';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LanguageModule} from '../shared/components/language/language.module';
import {MoonBackgroundModule} from '../shared/components/moon-background/moon-background.module';
import {ForgotPasswordComponent} from './sign-in/forgot-password/forgot-password.component';
import {NomenclatureModule} from "../shared/components/nomenclature/nomenclature.module";
import {ModalCloseButtonModule} from '../shared/components/modal-close-button/modal-close-button.module';
import {IonFabLanguageModule} from "../shared/components/ion-fab-language/ion-fab-language.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionPageRoutingModule,
    LanguageModule,
    MoonBackgroundModule,
    ReactiveFormsModule,
    ModalCloseButtonModule,
    NomenclatureModule,
    IonFabLanguageModule
  ],
  declarations: [ConnectionPage, SignInComponent, SignUpComponent, ForgotPasswordComponent]
})
export class ConnectionPageModule {
}
