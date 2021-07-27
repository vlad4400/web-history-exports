import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FbCreateResponse } from '../interfaces';
import { Record } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private http: HttpClient
  ) { }

  create(record: Record): Observable<Record> {
    return this.http.post(`${environment.fbDatabaseUrl}/records.json`, record)
      .pipe(
        map((response) => {
          return {
            ...record,
            id: (<FbCreateResponse>response).name,
            date: new Date(record.date)
          }
        })
      )
  }

  getListLocals(): string[] {
    return [
      'Local 1',
      'Local 2',
      'Local 3',
      'Local 4',
      'Local 5',
      'Local 6',
      'Local 7',
      'Local 8',
      'Local 9',
      'Local 10'
    ]
  }

  getAll(): Observable<Record[]> {
    return this.http.get(`${environment.fbDatabaseUrl}/records.json`)
      .pipe(map((response: {[key: string]: any}) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key
          }))
      }),
      // tap((e:any) => { console.log(e) })
      )
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDatabaseUrl}/records/${id}.json`)
  }
}
