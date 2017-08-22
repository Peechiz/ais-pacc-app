import { Component, OnInit, ViewChild } from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { ModalDirective } from 'ngx-bootstrap/modal';

@FadeInTop()
@Component({
  selector: 'sa-inbound-call',
  templateUrl: './inbound-call.component.html',
  styles: [`
    .step2 li {
      margin: 0.5em;
      border: 1px solid #fff;
      padding: 0.5em;
      background-color: #739e73;
      border-radius: 5px;
      color: #fff;
    }
    li {
      list-style: none;

    }`
  ]
})
export class InboundCallComponent implements OnInit {
  @ViewChild('childModal') public childModal: ModalDirective;
  callStatus: string = '';

  startCallTime: any;
  endCallTime: any;
  callDuration: any;
  totalMinutes: any;
  totalSeconds: any;
  totalCallTime: any;

  startLoad: boolean;
  endLoad: boolean;


  employeeName: string;
  private value: any = {};
  private _disabledV: string = '0';
  private disabled: boolean = false;


  constructor() {
    this.startLoad = false;
    this.endLoad = false;
  }

  ngOnInit() {
    this.employeeName = 'Seton'
  }
  public saveNotes(): void {
    this.childModal.show();
  }
  public hideChildModal(): void {
    this.childModal.hide();
    window.location.reload();
  }
  startCall() {
    this.startLoad = true;
    this.startCallTime = Date.now();
  }
  endCall() {
    this.endLoad = true;
    this.endCallTime = Date.now();
  }
  // getCallDuration(callDuration) {
  //     let callDuration = Math.abs(this.endCallTime - this.startCallTime) / 36e5;
  //     return callDuration;
  //     // this.totalMinutes = Math.floor(this.callDuration/60000);
  //     // this.totalSeconds = ((this.callDuration % 60000) / 1000).toFixed(0);
  //     // this.totalCallTime = this.totalMinutes + ":" + (this.totalSeconds < 10 ? '0': '') + this.totalSeconds;
  //     this.totalMinutes = (callDuration / 60000);
  //     // this.totalSeconds = (this.callDuration/1000) % 60;
  //     console.log(this.totalMinutes);
  // }

  public items: Array<string> = ['Seton', 'Providence', 'Daughters of Charity', 'Centro', 'Nazareth',
    'John Matthew', 'Seal Paul', 'John Paul', 'John Sena', 'Kyle', 'Justin TimberLake', 'Eminem'];

  onWizardComplete(data) {
    alert('oncall loaded!!');
  }

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }


}
