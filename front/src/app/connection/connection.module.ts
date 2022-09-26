import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionPageRoutingModule } from './connection-routing.module';

import { ConnectionPage } from './connection.page';

import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {LanguageModule} from '../shared/components/language/language.module';
import {NomenclatureModule} from './signup/nomenclature/nomenclature.module';
import {ForgotPasswordComponent} from './signin/forgot-password/forgot-password.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ConnectionPageRoutingModule,
        LanguageModule,
        NomenclatureModule
    ],
    declarations: [ConnectionPage, SigninComponent, SignupComponent, ForgotPasswordComponent]
})
export class ConnectionPageModule {}
