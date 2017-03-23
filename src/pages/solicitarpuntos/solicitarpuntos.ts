import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Lipigas } from '../../lipigas';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'solicitarpuntos',
  templateUrl: 'solicitarpuntos.html',
  providers: [Lipigas]
})
export class SolicitarPuntos {
  public puntosDisp: any;
  public puntosUso: any;
  public login: any;
  public loading: any;
  public primaryTab: boolean = true;
  public secondTab: boolean = false;
  public beneficios: any;
  public utilizados: any;
  public popupRequest: boolean = true;
  public overlayHidden: boolean = true;
  public IDLipipuntos: number = 0;
  public IDLipiSetup: number = 0;
  public tmpPuntosMenos: number = 0;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public http: Http, private service: Lipigas, public loadingController: LoadingController) {  
    this.loadTab1();
  }

  public loadTab1() {
    this.http.get(global.apipuntos+'/puntos?token='+localStorage.getItem("LipigasPersonasToken"))
    .map(res => res.json())
    .subscribe(
      data => this.processLipiPuntosAPI(data,'ok'),
      err => this.processLipiPuntosAPI(err,'err')
    );
    this.loading = this.loadingController.create({content:'cargando...'});
    this.loading.present();
  }

  public processLipiPuntosAPI(obj: any, res: string) {
    if (res == 'ok') {
      localStorage.setItem("LipigasPersonasDisponible", obj.lipipuntos_ptos_disponibles)
      localStorage.setItem("LipigasPersonasUtilizado", obj.lipipuntos_ptos_utilizados)
      this.puntosDisp = this.addCommas(localStorage.getItem("LipigasPersonasDisponible"));
      this.puntosUso = this.addCommas(localStorage.getItem("LipigasPersonasUtilizado")); 
    }
    this.http.get(global.apipuntos+'/getbeneficios?token='+localStorage.getItem("LipigasPersonasToken"))
    .map(res => res.json())
    .subscribe(
      data => this.processBeneficios(data,'ok'),
      err => this.processBeneficios(err,'err')
    );
  }

  public processBeneficios(obj: any, res: string) {
    this.loading.dismiss();
    if (res == 'ok') {
      for (var i = 0;i < obj.length;i++) {
        obj[i].solicitado = 0;
      }
      this.beneficios = obj;
    }
  }

  public closePopup() {
    this.popupRequest = true;
    this.overlayHidden = true;
  }

  public solicitar(id: number, ptos: number, i: number) {
  
    this.IDLipipuntos = id;
    this.IDLipiSetup = i;
    this.popupRequest = false;
    this.overlayHidden = false;
    this.tmpPuntosMenos = ptos;

  }

  public postSolicitar(fecha: string, horario: string) {
    var dt = new Date(fecha+' 20:00:00');   
    var dn = new Date();
    if (dt <= dn) { 
      let conf = this.alertCtrl.create({
      title: 'Error',
        message: 'Por favor seleccione una fecha superior a la fecha actual',
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
    else {
      this.loading = this.loadingController.create({content:'solicitando...'});
      this.loading.present();
      this.http.get(global.apipuntos+'/puntos/solicitar?token='+localStorage.getItem("LipigasPersonasToken")+'&IDLipipuntos='+this.IDLipipuntos+'&fecha='+fecha+'&horario='+horario)
      .map(res => res.json())
      .subscribe(
        data => this.processPostSolicitar(data,'ok',this.IDLipiSetup),
        err => this.processPostSolicitar(err,'err',this.IDLipiSetup)
      );
    }



  }  

  public processPostSolicitar(obj: any, res: string, i: number) {
    this.loading.dismiss();
    if (res == 'ok') {
      if (obj[0].Mensaje.indexOf("solicitado") >= 0) { 
        this.closePopup();
        this.beneficios[i].solicitado = 1;
        
        localStorage.setItem("LipigasPersonasDisponible", String(parseInt(localStorage.getItem("LipigasPersonasDisponible")) - this.tmpPuntosMenos));
        localStorage.setItem("LipigasPersonasUtilizado", String(parseInt(localStorage.getItem("LipigasPersonasUtilizado")) + this.tmpPuntosMenos));
        
        this.puntosDisp = this.addCommas(localStorage.getItem("LipigasPersonasDisponible"));
        this.puntosUso = this.addCommas(localStorage.getItem("LipigasPersonasUtilizado")); 

        let conf = this.alertCtrl.create({
        title: '',
          message: obj[0].Mensaje,
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

        this.IDLipiSetup = 0;
        this.IDLipipuntos = 0;
      }
      else {

        let conf = this.alertCtrl.create({
        title: 'Error',
          message: obj[0].Mensaje,
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
    else {
        let conf = this.alertCtrl.create({
        title: 'Error',
          message: 'No fue posible enviar la solicitud. Intente más tarde',
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

  toggleLipipuntos() {
    this.loadTab1();
    this.secondTab = false;
    this.primaryTab = true;
  }

  toggleUtilizados() {
    this.loadTab2();
    this.secondTab = true;
    this.primaryTab = false;
  }

  public loadTab2() {
    this.http.get(global.apipuntos+'/puntos/utilizados?token='+localStorage.getItem("LipigasPersonasToken"))
    .map(res => res.json())
    .subscribe(
      data => this.processLipiUtilizados(data,'ok'),
      err => this.processLipiUtilizados(err,'err')
    );
    this.loading = this.loadingController.create({content:'cargando...'});
    this.loading.present();
  }
  public processLipiUtilizados(obj: any, res: string) {
    this.loading.dismiss();
    if (res == 'ok') {
      this.utilizados = obj;
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