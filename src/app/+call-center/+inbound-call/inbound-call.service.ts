import { APIServices } from './../../shared/services/api.services';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { barChartDemoOptions } from '../../+graphs/+flot-charts/flot-examples';


@Injectable()
export class InboundService extends APIServices {
  getCallStatus(): Observable<any> {
    const url = this.baseUrl + '/call_statuses';
    // console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getCallOutComes(): Observable<any> {
    const url = this.baseUrl + '/call_outcomes';
    // console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getSearchData(param: string): Observable<any> {
    const url = this.baseUrl + '/Patients/search?filter=' + param;
    console.log(param);
    // console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getPatientDetail(param: string) {
    const url = this.baseUrl + '/Patients/' + param;
    console.log(param);
    // console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getStates(): Observable<any> {
    const url = this.baseUrl + '/States';
    console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getCalls(id: number): Observable<any> {
    const url = this.baseUrl + '/Patients/' + id  + '/calls';
    // console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getApps(): Observable<any> {
    return this._http.get('/assets/api/applications/appLinks.json').map((response: any) =>
    {return response.json(); }).catch(this.handleError.bind(this));
  }
  postCallsData(callsData: any, id: number) {
    const url = this.baseUrl + '/Patients/' + id + '/calls';
    // console.log(url);
    console.log(callsData);
    const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    const options = new RequestOptions({headers: headers});
    return this._http.post(url, callsData, options).map(res => res.json()).subscribe();
  }
  postNewPatient(newData: any) {
    const url = this.baseUrl + '/Patients';
    // console.log(url);
    console.log(newData);
    const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    const options = new RequestOptions({headers: headers});
    return this._http.post(url, newData, options).map(res => res.json()).subscribe();
  }
  putPatientDetails(editData: any, id: number) {
    const url = this.baseUrl + '/Patients/' + id;
    // console.log(url);
    console.log(editData);
    const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    const options = new RequestOptions({headers: headers});
    return this._http.put(url, editData, options).map(res => res.json()).subscribe();
  }
  getWrapCodes(sessionID, csrf) {
    // MAYBE this is technically supposed to come from I3 and not from cached JSON ? ¯\_(ツ)_/¯
    // const url = 'https://ciccrm.ascension.org/api/ahwivrtxpla001.ds.sjhs.com/icws/' + sessionID + '/messaging/messages';
    // const url = 'https://ciccrm.ascension.org/api/ahwivrtxpla001.ds.sjhs.com/icws/' + sessionID + '/configuration/wrap-up-codes';
    // const headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json',
    //                'ININ-ICWS-CSRF-Token' : csrf});
    //
    // const options = new RequestOptions({ headers: headers });
    // console.log(url);
    // return this._http.get(url, options).map((response: any) => { return response.json(); }).catch(this.handleError.bind(this));
    return this._http.get('/assets/api/applications/wrapUpcodes.json').map((response: any) =>
    {return response.json(); }).catch(this.handleError.bind(this));
  }
}
