import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Lipigas } from '../../lipigas';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'colaboradores',
  templateUrl: 'colaboradores.html',
  providers: [Lipigas]
})
export class Colaboradores {
  public login: any;
  public loading: any;
  public recupera: any;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public http: Http, private service: Lipigas, public loadingController: LoadingController) {  
    this.http.get(global.apipuntos+'/puntos/historialjefe?token='+localStorage.getItem("LipigasPersonasToken"))
    .map(res => res.json())
    .subscribe(
      data => this.processColaborador(data,'ok'),
      err => this.processColaborador(err,'err')
    );
    this.loading = this.loadingController.create({content:'cargando...'});
    this.loading.present();

  }
  public processColaborador(obj: any, res: string) {
    this.loading.dismiss();
    if (res == 'ok') {
      this.recupera = obj;

      for (var i=0;i<this.recupera.length;i++) {
        this.recupera[i].Fecha = this.recupera[i][ 'Fecha Solicitud' ];
        if (this.recupera[i].Autorizacion.toLowerCase().indexOf('rechaza') >= 0) { this.recupera[i].color = 'red'; }
        else { this.recupera[i].color = ''; }
      }
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