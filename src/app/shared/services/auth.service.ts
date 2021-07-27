import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FbAuthResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userName!: string

  public error$: Subject<string> = new Subject<string>()

  get token(): string {
    const expDate = new Date(<string>localStorage.getItem('fb-token-exp'))

    if (new Date() > expDate) {
      this.logout()
      return ''
    } else {
      return <string>localStorage.getItem('fb-token')
    }
  }

  constructor(private http: HttpClient) {
    let uName: string | null = localStorage.getItem('user-name')
    console.log(uName);

    if (uName) {
      this.userName = uName
    } else {
      this.userName = 'anonim'
    }
  }

  getUserName(): string {
    return this.userName
  }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        map((res: any) => (<FbAuthResponse>res)),
        tap(this.setToken),
        tap(() => {
          let uName = user.email.replace('@work.mail.com', '')
          localStorage.setItem('user-name', uName);
          this.userName = uName
        }),
        // map((res: any) => (res as Observable<FbAuthResponse>)),
        catchError(this.handleError.bind(this))
      )
  }

  logout(): void {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(response: FbAuthResponse | null): void {
    if (response) {

      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)

      // localStorage.setItem('username')

      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())

      } else {
      localStorage.clear()
    }
  }

  private handleError(httpResponse: HttpErrorResponse): any {
    const {message} = httpResponse.error.error

    console.log(message);
    switch(message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email nie znaleziony')
        break
      case 'INVALID_EMAIL':
        this.error$.next('E-mail niepoprawny')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Hasło niepoprawne')
        break
      default:
        this.error$.next(`Błąd: '${message}'`)
    }

    return throwError(httpResponse)
  }

}

