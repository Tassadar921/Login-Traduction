import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocketPage } from './socket.page';

const routes: Routes = [
  {
    path: '',
    component: SocketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocketPageRoutingModule {}
