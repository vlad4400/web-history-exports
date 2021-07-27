import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Record } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { RecordService } from '../shared/services/record.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form!: FormGroup
  listLocals!: string[]

  constructor(
    private authServis: AuthService,
    private recordService: RecordService
  ) { }

  ngOnInit(): void {
    this.listLocals =  this.recordService.getListLocals()

    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      local: new FormControl(null, Validators.required)
    })
  }

  submit(): void {
    if (this.form.valid) {

      const record: Record = {
        local: this.form.value.local,
        title: this.form.value.title,
        username: this.authServis.getUserName(),
        date: new Date()
      }

      this.recordService.create(record).subscribe(() => {

        this.form.reset()
      })

    }
  }

}
