import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfAccountPage } from './conf-account.page';

const routes: Routes = [
  {
    path: '',
    component: ConfAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfAccountPageRoutingModule {}
