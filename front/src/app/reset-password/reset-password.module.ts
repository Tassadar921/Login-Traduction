import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

import { ResetPasswordPage } from './reset-password.page';
import {NomenclatureModule} from "../shared/components/nomenclature/nomenclature.module";
import {MoonBackgroundModule} from '../shared/components/moon-background/moon-background.module';
import {ReturnToButtonModule} from '../shared/components/return-to-button/return-to-button.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ResetPasswordPageRoutingModule,
        ReactiveFormsModule,
        NomenclatureModule,
        MoonBackgroundModule,
        ReturnToButtonModule
    ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
