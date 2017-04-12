import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import {GoogleAnalytics} from 'ionic-native';
import { Http, Headers, RequestOptions } from '@angular/http';
import { VerPersona } from '../../pages/verpersona/verpersona';
import * as global from '../../global';
import { Lipigas } from '../../lipigas';

@Component({
  selector: 'cumpleanos',
  templateUrl: 'cumpleanos.html',
  providers: [Lipigas]
})
export class Cumpleanos implements OnInit{
  errorMessage: string = '';
  isLoading: boolean = true;
  public cumples: any;
  public loading: any;
  public perfil: any;
  public msg : any;

  constructor( public navCtrl: NavController, public params: NavParams, private service: Lipigas, public loadingController: LoadingController, public http: Http ) { 
    this.perfil = JSON.parse(localStorage.getItem("LipigasPersonas"));
  }

  ngOnInit(){

    this.loading = this.loadingController.create();
    this.loading.present();

    this.http.get(global.api+'/cumpleanos', this.headers())
    .map(res => res.json())
    .subscribe(
      data => this.processCumpleanos(data,'ok'),
      err => this.processCumpleanos(err,'err')
    );
    GoogleAnalytics.trackView("Cumpleanos");
  }

  goToPeople(rut: string) {
    this.navCtrl.push(VerPersona,{
      rut: rut
    });
  }


  private processCumpleanos(obj,tipo) {
    this.loading.dismiss();
    if (tipo == 'ok') { 
      this.cumples = obj.resultado;
    }
    else if (tipo == 'err') { 
    this.service.logError(obj, 'No fue posible obtener los cumpleaños de esta semana. Por favor intenta más tarde.'); 
    }
  }


  private headers() {
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+this.perfil.token);
      let options = new RequestOptions({ headers: headers });
      return options;
  }


}
