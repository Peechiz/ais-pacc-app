import { APIServices } from './../../shared/services/api.services';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';


@Injectable()
export class InboundService extends APIServices {

  getInboundData(): Observable<any> {
    const url = 'https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/open/Patient/SMART-1551992';
    console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
  }
  getPatientsList(): Observable<any> {
    const url = this.baseUrl + '/patients';
    console.log(url);
    return this._http.get(url, this.options).map((response: any) => {return response.json(); }).catch(this.handleError.bind(this));
    // return this._http.get('assets/api/json/patientsList.json');
  }
}
