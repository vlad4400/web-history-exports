import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Record } from '../shared/interfaces';
import { RecordService } from '../shared/services/record.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [DatePipe]
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  form!: FormGroup

  originRecords: Record[] = []
  records: Record[] = []
  subGetAll!: Subscription
  subRemove!: Subscription
  listLocals!: string[]

  dateNow: Date = new Date()

  dateNowStr!: string


  constructor(
    private recordService: RecordService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.dateNowStr = <string>this.datePipe.transform(this.dateNow, 'yyyy-MM-dd')

    this.listLocals =  this.recordService.getListLocals()

    this.subGetAll = this.recordService.getAll().subscribe( posts => {
      this.records = this.originRecords = posts
    })

    this.form = new FormGroup({
      local: new FormControl((this.listLocals ? 0 : null), Validators.required),
      dateFrom: new FormControl((this.dateNowStr ? this.dateNowStr : null), Validators.required),
      dateTo: new FormControl((this.dateNowStr ? this.dateNowStr : null), Validators.required)
    })
  }

  remove(id: string = ''): void {
    if (id) {
      this.subRemove = this.recordService.remove(id).subscribe( () => {
        this.records = this.records.filter(record => record.id !== id)
      })
    } else {
      console.log('Błąd usuwania wpisu. "Id" nie istnieje');
    }
  }

  filter() {
    console.log(this.form.value);
    this.records = this.originRecords.filter(record => record.local === this.form.value.local)
    this.records = this.records.filter(record => new Date(record.date) > new Date(this.form.value.dateFrom))

    let endDate = new Date(this.form.value.dateTo)
    endDate.setDate(endDate.getDate() + 1)

    this.records = this.records.filter(record => new Date(record.date) < new Date(endDate))
  }

  ngOnDestroy(): void {
    if (this.subGetAll) {
      this.subGetAll.unsubscribe()
    }
  }

}
