import { Component, ViewChild } from '@angular/core';
import { Nav, NavController, AlertController, MenuController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Lipigas } from '../../lipigas';
import { Cumpleanos } from '../../pages/cumpleanos/cumpleanos';
import { AprobarPuntos } from '../../pages/aprobarpuntos/aprobarpuntos';
import { SolicitarPuntos } from '../../pages/solicitarpuntos/solicitarpuntos';
import { NoticiasComponent } from '../../pages/noticias/noticias';
import { NoticiaService } from '../../pages/noticias/noticia.service';
import { Perfil } from '../../pages/perfil/perfil';
import { Login } from '../../pages/login/login';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

import { Globals } from '../perfil/global-vars';

@Component({
  selector: 'home',
  templateUrl: 'home.html',
  providers: [Lipigas, NoticiaService]
})

export class Home {
  @ViewChild(Nav) nav: Nav;
  public perfil: any;
  public globals: any;
  mainPage: any = NoticiasComponent;
  public isAuth: boolean = false;
  public isPeople: boolean = false;

  constructor(public navCtrl: NavController, public http: Http, private service: Lipigas, private alertCtrl: AlertController, public menuCtrl: MenuController) {
    this.perfil = JSON.parse(localStorage.getItem("LipigasPersonas"));
    this.globals = Globals;
    this.globals.avatar = 'url(' + this.perfil.avatar + ')';

    // update perfil
    let headers = new Headers();
    headers.append('Authorization', 'Bearer '+this.perfil.token);

    this.http.get(global.api+'/perfil/'+this.perfil.rut, {headers: headers})
    .map(res => res.json())
    .subscribe(
      data => this.processUpdateProfileME(data,'ok'),
      err => this.processUpdateProfileME(err,'err')
    );
    // for layout
    this.perfil.firstname = this.perfil.nombres.split(' ');
    this.perfil.firstname = this.perfil.firstname[0];
    this.perfil.lastname = this.perfil.apellidos.split(' ');
    this.perfil.lastname = this.perfil.lastname[0];

    let formData = new FormData();
    formData.append('rut', this.perfil.rut);

    this.http.post(global.apipuntos+'/login', formData)
    .map(res => res.json())
    .subscribe(
      data => this.processLipiPuntosAPI(data,'ok'),
      err => this.processLipiPuntosAPI(err,'err')
    );


  }
  public processUpdateProfileME(obj: any, res: string) {
    if (res == 'ok') {
      this.perfil.avatar = obj.avatar;
    }
  }

  public processLipiPuntosAPI(obj: any, res: string) {
    if (res == 'ok') {
      if (obj.Autorizador == true) {
        this.isAuth = true;
      }
      else {
        this.isPeople = true;
      }
      localStorage.setItem("LipigasPersonasToken", obj.token);
      localStorage.setItem("LipigasPersonasDisponible", obj.lipipuntos_ptos_disponibles);
      localStorage.setItem("LipigasPersonasUtilizado", obj.lipipuntos_ptos_utilizados);
    }
  }
  hola() { 
  console.log('dick');
  }
  goToMiCuenta() {
    this.nav.setRoot(Perfil);
    this.menuCtrl.close();
  }
  goToNoticias() {
    this.nav.setRoot(NoticiasComponent);
    this.menuCtrl.close();
  }
  goToCumpleanos() {
    this.nav.setRoot(Cumpleanos);
    this.menuCtrl.close();
  }
  goToSolicitaLipipuntos() {
    this.nav.setRoot(SolicitarPuntos);
    this.menuCtrl.close();
  }
  goToAprobarLipipuntos() {
    this.nav.setRoot(AprobarPuntos);
    this.menuCtrl.close();
  }
  goToLogout() {
    let conf = this.alertCtrl.create({
    title: 'Cerrar sesión',
      message: '¿Deseas cerrar tu sesión de Lipigas Personas?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Salir',
          handler: () => {
            localStorage.removeItem("LipigasPersonas");
            this.menuCtrl.close();
            this.navCtrl.setRoot(Login);
          }
        }
      ]
    });
    conf.present();
  }
}
