import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryDashboardComponent } from './components/inventory-dashboard/inventory-dashboard.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  { path: 'events', component: ScheduleComponent },
  { path: 'collection', component: InventoryDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
