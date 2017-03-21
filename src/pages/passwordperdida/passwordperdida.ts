import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Lipigas } from '../../lipigas';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'passwordperdida',
  templateUrl: 'passwordperdida.html',
  providers: [Lipigas]
})
export class PasswordPerdida {
  public loading: any;
  public popupRecoverHidden: boolean = true;
  public overlayHidden: boolean = true;

  constructor(public navCtrl: NavController, public http: Http, private service: Lipigas, public loadingController: LoadingController) {

  }

  goBack() {
    this.navCtrl.pop();
  }

  goRecover(rut: String) {
    rut = rut.replace('.','');

    if (rut == '') {
      this.service.logError(null,'Rut es requerido');
    }
    else {
      this.loading = this.loadingController.create({content:'solicitando...'});
      this.loading.present();

      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
      let options = new RequestOptions({ headers: headers });

      this.http.post(global.api+'/login/recuperar', {rut: rut}, options)
      .map(res => res.json())
      .subscribe(
        data => this.processRecover(data,'ok'),
        err => this.processRecover(err,'err'),
        () => this.loading.dismiss()
      );
    }
  }

  private processRecover(obj,tipo) {
    this.loading.dismiss();
    if (tipo == 'ok') {
      localStorage.setItem( "LipigasPersonas" , obj);
      this.popupRecoverHidden = false;
      this.overlayHidden = false;
    }
    else if (tipo == 'err') {
      if (obj.status == '404') { this.service.logError(obj, 'El RUT no es colaborador de Lipigas'); }
      else { this.service.logError(obj); }
    }
  }

  public closePopup() {
    this.popupRecoverHidden = true;
    this.overlayHidden = true;
  }
}
