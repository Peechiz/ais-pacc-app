import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoginService } from './login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  @ViewChild('auth2Modal') public auth2Modal: ModalDirective;
  form: any = {};
  returnUrl: string;
  idProviders: any;
  ssoHTML: any;
  singleSignOnToken: any;
  isSignOn: boolean;
  postResponse: any;
  sessionId: any;
  userId: any;
  userName: any;
  user: any;
  tmp: any;
  isAuthenticated: boolean;
  constructor(private router: Router, private _loginService: LoginService) {
    this.isAuthenticated = false;
   }

  ngOnInit() {
  // retrieve the previousUrl from route params or default to '/'
    this.isSignOn = false;
    const prevUrl = localStorage.getItem('prevUrl');
    this.returnUrl = prevUrl ? prevUrl : '/call-center/inbound-call';
    this.getIcFeatures();
    this.getIcVersion();
    this.getIcSSO();
    this.ssoTimeOut();
  }
  reDirectUri() {
    window.open('https://ciccrm.ascension.org/api/ahwivrtxpla001.ds.sjhs.com/icws/connection/single-sign-on' +
    '/identity-providers/' + this.idProviders + '?' +
    'singleSignOnCapabilities=saml2Post%2Csaml2Redirect&redirectUri=https%3A%2F%2Fwww.google.com'); //wait why tho?

    console.log('navigating to: https://www.google.com');
    this.responseTimeOut();
  }
  getIcFeatures() {
    this._loginService.getIcFeatures()
    .subscribe(
      (response: any) => {
        console.log(response);
      }
    )
  }
  getIcVersion() {
    this._loginService.getIcVersion()
    .subscribe(
      (response: any) => {
        console.log(response);
      }
    )
  }
  getIcSSO() {
    this._loginService.getIcSSO()
    .subscribe(
      (response: any) => {
        this.idProviders = response.authentication.identityProviders[0].identityProviderId;
      }
    )
  }
  public ssoTimeOut() {
    setTimeout(() => this.getIcSSOProviders(), 1000);
  }
  getIcSSOProviders() {
    this._loginService.getSSOidProviders(this.idProviders)
    .subscribe(
      (response: any) => {
        console.log(this.ssoHTML);
      }
    )
   this.reDirectUri();
  }
  public responseTimeOut() {
    setTimeout(() => this.getSSOResponse(), 5000);
  }
  getSSOResponse() {
    this._loginService.getSSOResponse()
    .subscribe(
      (response: any) => {
        this.singleSignOnToken = response.singleSignOnToken;
        console.log(this.singleSignOnToken);
      }
    )
  }
  postSamlRequest() {
    this._loginService.postSamlRequest()
  }
  getSSOReturn() {
    this._loginService.getSSOReturn()
    .subscribe(
      (response: any) => {
        console.log(response);
      }
    )
  }
  onSubmit() {
    this.form = {
      '__type': 'urn:inin.com:connection:singleSignOnTokenConnectionRequestSettings',
      'applicationName': 'Interaction Connect',
      'singleSignOnToken': this.singleSignOnToken
    }
    this._loginService.onsubmit(this.form)
      .subscribe((response: any) => {
       this.postResponse = response;
       console.log('user maybe?',this.postResponse)
      //  this.updateCredentials(this.postResponse);
       this.sessionId = response.sessionId;

       this.userId = response.userID;
       this.userName = response.userDisplayName;
       sessionStorage.setItem('SessionId', this.sessionId);
       sessionStorage.setItem('userName', this.userName);
       sessionStorage.setItem('csrf', response.csrfToken);
       sessionStorage.setItem('fullUser', JSON.stringify(response))
       sessionStorage.setItem('userID', this.userId)
       this.getUserAuth2();
       if (this.isAuthenticated = true) {
        this.router.navigate([this.returnUrl]);
      }
    });
    // alert('login successful! and navigating to ' + this.returnUrl + ' ');
  }
  // updateCredentials(credentials) {
  //   this.user = credentials;
  //   console.log(this.user);
  //   this.isSignOn = true;
  // }
  // timeOut() {
  //   setTimeout(() => this.isAuthenticated = true, 7000);
  // }
  public getUserAuth2() {
    this.isAuthenticated = false;
    this.auth2Modal.show();
  }
  public hideauth2Modal(): void {
    this.auth2Modal.hide();
  }
}
