import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Lipigas } from '../../lipigas';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'aprobarpuntos',
  templateUrl: 'aprobarpuntos.html',
  providers: [Lipigas]
})
export class AprobarPuntos {

  public login: any;
  public loading: any;
  public aprobables: any;
  public NoHay: boolean = false;
  public MensajeSistema: any;

  constructor(public navCtrl: NavController, public http: Http, private alertCtrl: AlertController, private service: Lipigas, public loadingController: LoadingController) {  

    // Fake testing
    // localStorage.setItem("LipigasPersonasToken", "Cekm30SVUm6BBlOOfN2l01ZkOG6BxOs1Zsu_OHqlU5U");

    this.http.get(global.apipuntos+'/puntos/pendientesaprobacion?token='+localStorage.getItem("LipigasPersonasToken"))
    .map(res => res.json())
    .subscribe(
      data => this.processAprobables(data,'ok'),
      err => this.processAprobables(err,'err')
    );

    this.loading = this.loadingController.create({content:'cargando...'});
    this.loading.present();

  }

  public processAprobables(obj: any, res: string) {
    this.loading.dismiss();
    if (res == 'ok') {
      if (obj[0].Mensaje) { 
        this.MensajeSistema = obj[0].Mensaje;
        this.NoHay = true;
      }
      else {
        for (var i = 0;i < obj.length;i++) {
          obj[i].rechazado = 0;
          obj[i].aprobado = 0;
        }
        this.aprobables = obj;
      }
    }
  }

  public aprobar(IDSolicitud: number, i: number) {
    this.loading = this.loadingController.create({content:'aprobando...'});
    this.loading.present();

    let formData = new FormData();
    formData.append('token', localStorage.getItem("LipigasPersonasToken"));
    formData.append('IDSolicitud', IDSolicitud);
    formData.append('aprobar', '1');

    this.http.post(global.apipuntos+'/puntos/aprobar?token='+localStorage.getItem("LipigasPersonasToken"), formData)
    .map(res => res.json())
    .subscribe(
      data => this.processPostApi(data,'ok',i, 'aprobar'),
      err => this.processPostApi(err,'err',i, 'aprobar')
    );

  }  

  public rechazar(IDSolicitud: number, i: number) {
    this.loading = this.loadingController.create({content:'rechazando...'});
    this.loading.present();

    let formData = new FormData();
    formData.append('token', localStorage.getItem("LipigasPersonasToken"));
    formData.append('IDSolicitud', IDSolicitud);
    formData.append('aprobar', '0');

    this.http.post(global.apipuntos+'/puntos/aprobar?token='+localStorage.getItem("LipigasPersonasToken"), formData)
    .map(res => res.json())
    .subscribe(
      data => this.processPostApi(data,'ok',i, 'rechazar'),
      err => this.processPostApi(err,'err',i, 'rechazar')
    );

  } 

  public processPostApi(obj: any, res: string, i: number, action: string) {
    this.loading.dismiss();
    if (res == 'ok') {
      var isError = (obj instanceof Array ? 1 : 0);
      let conf = this.alertCtrl.create({
      title: '',
        message: (obj instanceof Array ? obj[0].Mensaje : obj.Mensaje),
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              
            }
          }
        ]
      });
      conf.present();

      if (action == 'rechazar' && !isError) { 
        this.aprobables[i].rechazado = 1;
        this.aprobables[i].aprobado = -1;
      }
      if (action == 'aprobar' && !isError) { 
        this.aprobables[i].aprobado = 1;
        this.aprobables[i].rechazado = -1;
      }
    } else {
        let conf = this.alertCtrl.create({
        title: 'Error',
          message: 'No fue posible el proceso. Intente más tarde',
          buttons: [
            {
              text: 'OK',
              role: 'cancel',
              handler: () => {
                
              }
            }
          ]
        });
        conf.present();
    }
  }


  public addCommas(nStr: string) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? ',' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
      }
      return x1 + x2;
  }
  public toddmmyyyy(input: string) {
      var ptrn = /(\d{4})\-(\d{2})\-(\d{2})/;
      if(!input || !input.match(ptrn)) {
          return null;
      }
      return input.replace(ptrn, '$3/$2/$1');
  };


}

