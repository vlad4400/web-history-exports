import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Record } from '../shared/interfaces';
import { RecordService } from '../shared/services/record.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  records: Record[] = []
  recordsSub!: Subscription
  listLocals!: string[]

  constructor(
    private recordService: RecordService
  ) { }

  ngOnInit(): void {
    this.listLocals =  this.recordService.getListLocals()
    
    this.recordsSub = this.recordService.getAll().subscribe( posts => {
      this.records = posts
    })
  }



  ngOnDestroy(): void {
    if (this.recordsSub) {
      this.recordsSub.unsubscribe()
    }
  }

}
