import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Lipigas } from '../../lipigas';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'verpersona',
  templateUrl: 'verpersona.html',
  providers: [Lipigas]
})
export class VerPersona {
  public perfil: any;
  public login: any;
  public loading: any;
  public rut: any;
  public isMe: boolean = false;

  constructor(public navCtrl: NavController, public http: Http, private service: Lipigas, public loadingController: LoadingController, public params: NavParams) {

    this.rut = params.get("rut");

    this.login = JSON.parse(localStorage.getItem("LipigasPersonas"));
    this.perfil = {
      "rut": "",
      "email": "",
      "avatar": "",
      "nombres": "",
      "apellidos": "",
      "cargo": "",
      "unidad": "",
      "ubicacion": "",
      "pais": "",
      "fecha_nacimiento": "",
      "telefono_oficina": "",
      "telefono_oficina_mod": "",
      "telefono_movil": "",
      "skype": "",
      "google_id": "",
      "descripcion": ""
    }
    this.loading = this.loadingController.create({content:'cargando...'});
    this.loading.present();


    let headers = new Headers();
    headers.append('Authorization', 'Bearer '+this.login.token);

    this.http.get(global.api+'/perfil/'+this.rut, {headers: headers})
    .map(res => res.json())
    .subscribe(
      data => this.processRequestProfile(data,'ok'),
      err => this.processRequestProfile(err,'err')
    );

  }

  public processRequestProfile(obj: any, res: string) {
    this.loading.dismiss();
    if (res == 'ok') {
      this.perfil = obj;
      if (this.perfil.rut == this.login.rut) {
        this.isMe = true;
      }
      if (this.perfil.telefono_oficina == null) { this.perfil.telefono_oficina = ""; }
      
      this.perfil.telefono_oficina_mod = this.perfil.telefono_oficina.replace('02-','2');
    }
    else if (res == 'err') {
      this.service.logError(obj, 'No fue posible recuperar tu perfil. Revisa que tu conexión a internet esté disponible.');
    }
  }



}

