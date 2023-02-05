import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MoonBackgroundComponent} from './moon-background.component';

@NgModule({
  declarations: [MoonBackgroundComponent],
  imports: [CommonModule],
  exports: [MoonBackgroundComponent]
})
export class MoonBackgroundModule { }
