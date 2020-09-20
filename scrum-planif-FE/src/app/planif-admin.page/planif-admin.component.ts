import { Component } from '@angular/core';
import { PlanifComponent } from '../planif.page/planif.component';
import { PlanifRoom } from '../planif.room/planif.room';

@Component({
  selector: 'app-planif-admin',
  templateUrl: 'planif-admin.component.html',
  styleUrls: ['./planif-admin.component.scss'],
  providers:  [ PlanifRoom ]
})
export class PlanifAdminComponent extends PlanifComponent { }
