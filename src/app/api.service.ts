import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

const baseAPI = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public getSessionID() {
    return this.http.post(baseAPI + '/epubreader/sessions?length=1', {}).pipe(map(res => res as any));
  }

  public validateSession(sessionID: string) {
    return this.http.get(baseAPI + '/epubreader/sessions/' + sessionID + '/status').pipe(map(res => res as HttpResponse<any>));
  }
}
