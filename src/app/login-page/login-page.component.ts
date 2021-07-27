import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  submitted: boolean = false
  message: string = ''

  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  })

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['notAuthorized']) {
        this.message = 'Nie jesteś zalogowany. Proszę się zalogować'
      } else if (params['authFailed']) {
        this.message = 'Błąd autoryzacji. Zaloguj się jeszcze raz'
      }
    })
  }

  submit(): void {
    if (this.form.invalid) {
      return
    }

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }

    this.submitted = true

    this.auth.login(user).subscribe(() => {
      this.form.reset()
      this.submitted = false
      this.router.navigate(['/dashboard'])
    }, () => {
      this.submitted = false
    })
  }

}
