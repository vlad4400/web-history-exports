import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Record } from '../shared/interfaces';
import { RecordService } from '../shared/services/record.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  form!: FormGroup

  originRecords: Record[] = []
  records: Record[] = []
  recordsSub!: Subscription
  listLocals!: string[]

  dateNow!: string
  dateMin!: string
  dateMax!: string

  constructor(
    private recordService: RecordService
  ) { }

  ngOnInit(): void {
    this.dateMax = this.dateNow = this.getCurrentDate();

    this.listLocals =  this.recordService.getListLocals()

    this.recordsSub = this.recordService.getAll().subscribe( posts => {
      this.records = this.originRecords = posts
    })

    this.form = new FormGroup({
      local: new FormControl((this.listLocals ? 0 : null), Validators.required),
      dateFrom: new FormControl((this.dateNow ? this.dateNow : null), Validators.required),
      dateTo: new FormControl((this.dateNow ? this.dateNow : null), Validators.required)
    })
  }

  filter() {
    console.log(this.form.value);
    this.records = this.originRecords.filter(record => record.local === this.form.value.local)
    this.records = this.records.filter(record => new Date(record.date) > new Date(this.form.value.dateFrom))

    let endDate = new Date(this.form.value.dateTo)
    endDate.setDate(endDate.getDate() + 1)

    this.records = this.records.filter(record => new Date(record.date) < new Date(endDate))
  }

  getCurrentDate() {
    const today = new Date()
    const year = today.getFullYear()
    const months = today.getMonth()
    const day = today.getDate()

    return `${year}-${(months < 9) ? '0' : ''}${months+1}-${(day < 10) ? '0' : ''}${day}`
  }

  ngOnDestroy(): void {
    if (this.recordsSub) {
      this.recordsSub.unsubscribe()
    }
  }

}
