import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FadeInTop } from '../../shared/animations/fade-in-top.decorator';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InboundService } from './inbound-call.service';
import * as moment from 'moment';
import Debounce from 'debounce-decorator'


import { fadeInTop } from '../shared/animations/router.animations';

declare var $: any;

@FadeInTop()
@Component({
  selector: 'app-inbound-call',
  templateUrl: './inbound-call.component.html',
  styles: [`
    .step2 {
      border: 1px solid #fff;
      padding: 0.5em;
      background-color: #739e73;
      border-radius: 5px;
      color: #fff;
      display: block;
    }
    li {list-style: none;}
    .step2 a {color: #fff; font-weight: 700;}
    .two {
       font-size: 20px;
    }
  `],
})
export class InboundCallComponent implements OnInit, OnDestroy {
  @ViewChild('childModal') public childModal: ModalDirective;
  // private callStatus: string;

  private $startCallTime: any;
  private $endCallTime: any;
  private $minutes: any;
  private $seconds: any;
  private context: any;
  private individualDetails: any = {
    first_name: null,
    middle_name: null,
    last_name: null,
    dob: null,
    gender: null,
    home_phone: null,
    work_phone: null,
    mobile_phone: null,
    email: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    preferred_contact_method: null
  }
  private patientList: any;
  private callStatusData: any;
  private callOutComesData: any;
  private selectedContactType: any;
  private selectedGender: any;
  public selectedState: any;
  private statesList: any;
  private states_list: any;
  private callsList: any;
  private calls_list: any;
  private callsSum: any;
  private patientAge: any;
  public _id: any;
  public newData: any;
  public selectedItem: '';
  public patID: number;
  private last_name: string;
  private first_name: string;
  private middle_name: string;
  private gender: string;
  private dob: any;
  private home_phone: string;
  private work_phone: string;
  private mobile_phone: string;
  private email: string;
  private address1: string;
  private address2: string;
  private zip: string;
  private city: string;
  private state: string;
  private preferred_contact_method: string;
  private _startRecording: boolean;
  private _endRecording: boolean;
  private _endCall: boolean;
  private _addPatients: boolean;
  private _showsearchResults: boolean;
  private _loadmetrics: boolean;
  private callsListLength: boolean;
  private applications: any;
  private appLinks: any;
  public notes: string = '';
  private _callWarning: boolean = true;
  private _warningMessage: string = 'Please start the call first.';

  public mask=['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  birthdate: Date;
  form: any = { $searchStr: '', searchObjects: [], display: 'none' };
  addPatient: any = {};
  editPatient: any = {};

  // public selected: any[] = [];

  private selectedOutcomes: any = [];

  sessionID: any;
  csrf: any;

  private wrapCodes: any = []

  demoShowTabs = false;

  toggle = {};

  constructor(
    private _InboundService: InboundService
  ) {
    this._startRecording = false;
    this._endRecording = false;
    this._endCall = true;
    this._showsearchResults = false;
    this._loadmetrics = false;
    this._addPatients = false;
    this.callsListLength = false;
  }

  toggleMultiSelect(event, val) {
    event.preventDefault();
    if (this.selectedOutcomes.indexOf(val) === -1) {
      this.selectedOutcomes = [...this.selectedOutcomes, val];
      console.log('selected outcomes',this.selectedOutcomes);
    } else {
      this.selectedOutcomes = this.selectedOutcomes.filter(function (elem) {
        return elem !== val;
      })
      console.log('selected outcomes',this.selectedOutcomes);
    }
  }

  ngOnInit() {
    this.getCallStatus();
    this.getStates();
    this.getApps();
    this.sessionID = sessionStorage.getItem('SessionId');
    this.csrf = sessionStorage.getItem('csrf');
    this.setMessageTimeOut();
    // console.log('user', sessionStorage.getItem('fullUser'))
    // console.log('group:', sessionStorage.getItem('userGroup'))
  }
  ngOnDestroy() {
    console.clear();
    console.log('On Destroy');
  }
  public startCall() {
    this._callWarning = false;
    this._startRecording = true;
    const startTime = new Date();
    this.$startCallTime = startTime.getTime();
    this._endRecording = false;
    this._endCall = false;
  }
  public endCall() {

    // check to see if a wrap code has been given...
    // otherwise, throw an error.
    if (this.selectedOutcomes.length){
      this._callWarning = false;
      this._endRecording = true;
      const endTime = new Date();
      this.$endCallTime = endTime.getTime();

      const diff = this.$endCallTime - this.$startCallTime;
      this.$minutes = Math.floor(diff / 60000);
      this.$seconds = Math.floor(diff / 1000) % 60;
      this._endCall = true;
      this.postCalls();
    } else {
      this._warningMessage = 'Please select an outcome before ending the call.'
      this._callWarning = true;
    }

  }
  public loadMetrics($id: any) {
    this._InboundService.getPatientDetail($id)
      .subscribe(
      (response: any) => {
        this._loadmetrics = true;
        this.individualDetails = response; // patient details
        console.log('Patient:',this.individualDetails)
        this.patID = response.id;
        this.selectedContactType = this.individualDetails['preferred_contact_method'];
        this.selectedState = this.individualDetails['state'];
        this.selectedGender = this.individualDetails['gender'];
        this.birthdate = this.individualDetails['dob'];
        this.patientAge = this.getPatAge(this.individualDetails['dob']);
        this._addPatients = false;
        console.log(this.home_phone);
        this.getCalls();
      });
  }
  public getCallStatus() {
    this.patientList = this._InboundService.getCallStatus()
      .subscribe((response: any) => {
        this.callStatusData = response;
        if (this.callStatusData.length > 0) {
          this.selectedItem = this.callStatusData[0]['status'];
        }
      })
  }
  @Debounce(200)
  public getPatientList() {
    if (this.form.$searchStr.length > 0) {
      this._InboundService.getSearchData(this.form.$searchStr)
        .subscribe(
        (response: any) => {
          this.form.searchObjects = response.filter;
          this._showsearchResults = true;
          this.form.display = 'block';
        }
        )
    } else {
      this.form.searchObjects = [];
    }
  }
  public getApps() {
    this.appLinks = this._InboundService.getApps()
      .subscribe((response: any) => {
        this.applications = response.applications;
        // console.log(this.applications);
      })
  }
  public getWrapCodes() {
    this._InboundService.getWrapCodes(this.sessionID, this.csrf)
      .subscribe(
      (response: any) => {
        this.wrapCodes = response.items;
      });
  }
  public getStates() {
    this.statesList = this._InboundService.getStates()
      .subscribe((response: any) => {
        this.states_list = response;
      })
  }
  public getCalls() { // TODO get notes for call
    this._InboundService.getCalls(this.patID)
      .subscribe((response: any) => {
        this.calls_list = response;
        // console.log('Calls List:',this.calls_list)
        this.callsSum = this.calls_list.length;
        if (this.calls_list.length > 0) {
          this.callsListLength = true;
        }
      })
  }
  public postCalls() {
    this._id = this.patID;

    const postCallData = {
      'call_start_date_time': moment(this.$startCallTime).format('MM/DD/YYYY, hh:mm:ss a'),
      'call_stop_date_time': moment(this.$endCallTime).format('MM/DD/YYYY, hh:mm:ss a'),
      'call_agent': sessionStorage.getItem('userName'),
      'call_note_text': this.notes,
      'call_outcome_desc': JSON.stringify(this.selectedOutcomes)
    }
    console.log(postCallData);
    this._InboundService.postCallsData(postCallData, this._id);
    // this.callBackTimeOut();
  }
  public addPatientList() {
    this.context = null;
    this.last_name = '';
    this.first_name = '';
    this.middle_name = '';
    this.home_phone = '';
    this.work_phone = '';
    this.mobile_phone = '';
    this.email = '';
    this.address1 = '';
    this.address2 = '';
    this.zip = '';
    this.city = '';
    this.state = '';
    this.preferred_contact_method = '';

    this.form.display = 'none',
    this.selectedGender = 'Select Gender',
    this.selectedContactType = 'Select Preferred Contact';
    this.selectedState = 'Select State';
    this._addPatients = true;
    this._loadmetrics = false;
  }
  public updatePatientsList(obj: any) {
    this.context = obj;
    this.last_name = this.context.last_name;
    this.first_name = this.context.first_name;
    this.middle_name = this.context.middle_name;
    this.dob = this.birthdate;
    this.selectedGender = this.selectedGender;
    this.home_phone = this.context.home_phone;
    this.work_phone = this.context.work_phone;
    this.mobile_phone = this.context.mobile_phone;
    this.email = this.context.email;
    this.address1 = this.context.address1;
    this.address2 = this.context.address2;
    this.zip = this.context.zip;
    this.city = this.context.city;
    this.selectedState = this.selectedState;
    this.preferred_contact_method = this.preferred_contact_method;
    this._addPatients = true;
    this._loadmetrics = false;
  }
  public onPatientUpdate() {
    this._id = this.patID;
    if (this.context != null) {
      const editData = {
        'last_name': this.last_name.toUpperCase(),
        'first_name': this.first_name.toUpperCase(),
        'middle_name': this.middle_name,
        'dob': moment(this.birthdate).format('MM/DD/YYYY'),
        'gender': this.selectedGender,
        'home_phone': this.individualDetails.home_phone.replace(/\D/g, ''), // strips formatting on save
        'work_phone': this.individualDetails.work_phone.replace(/\D/g, ''),
        'mobile_phone': this.individualDetails.mobile_phone.replace(/\D/g, ''),
        'email': this.email,
        'address1': this.address1,
        'address2': this.address2,
        'zip': this.zip,
        'city': this.city,
        'state': this.selectedState,
        'preferred_contact_method': this.selectedContactType
      }
      this._InboundService.putPatientDetails(editData, this._id)
    } else {
      const newData = {
        'first_name': this.first_name.toUpperCase(),
        'middle_name': this.middle_name,
        'last_name': this.last_name.toUpperCase(),
        'dob': moment(this.birthdate).format('MM/DD/YYYY'),
        'gender': this.selectedGender,
        'home_phone': this.individualDetails.home_phone.replace(/\D/g, ''),
        'work_phone': this.individualDetails.work_phone.replace(/\D/g, ''),
        'mobile_phone': this.individualDetails.mobile_phone.replace(/\D/g, ''),
        'email': this.email,
        'address1': this.address1,
        'address2': this.address2,
        'zip': this.zip,
        'city': this.city,
        'state': this.selectedState,
        'preferred_contact_method': this.selectedContactType
      }
      this._InboundService.postNewPatient(newData);
    }
    this._addPatients = false;
    this.getPatientList();
   // this.saveNotes();
    this.loadMetrics(this.patID);
  }
  public showContactType(contactMethod: any) {
    this.selectedContactType = contactMethod;
  }
  public showGender(gender: any) {
    this.selectedGender = gender;
  }
  public showStatus(status: any) {
    this.selectedItem = status;
  }
  public showState(state: any) {
    this.selectedState = state;
  }
  public hideChildModal(): void {
    this.childModal.hide();
  }
  public getPatAge(d: any) {
    const age = moment().diff(d, 'years');
    return age;
  }
  public callBackTimeOut() {
    setTimeout(() => this.getCalls(), 1000);
  }
  public reloadTimeOut() {
    setTimeout(() => window.location.reload(), 5000)
  }
  public setMessageTimeOut() {
    setTimeout(() => this.getWrapCodes(), 2500)
  }
  onWizardComplete(data) {
    alert('oncall loaded!!');
  }
}
