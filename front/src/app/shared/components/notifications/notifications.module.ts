import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsComponent } from './notifications.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [NotificationsComponent],
  imports: [CommonModule, IonicModule],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
