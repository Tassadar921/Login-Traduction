import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPagesSystemFooterComponent } from './common-pages-system-footer.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [CommonPagesSystemFooterComponent],
  imports: [CommonModule, IonicModule],
  exports: [CommonPagesSystemFooterComponent]
})
export class CommonPagesSystemFooterModule { }
