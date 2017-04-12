import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PasswordPerdida } from '../passwordperdida/passwordperdida';
import { Home } from '../home/home';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Lipigas } from '../../lipigas';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  providers: [Lipigas]
})

export class Login {
	public loading: any;
  constructor(public navCtrl: NavController, public http: Http, private service: Lipigas, public loadingController: LoadingController) {

    
  }

  goToPasswordPerdida() {
    this.navCtrl.push(PasswordPerdida);
  }

  login(rut: String, password: String) {
  	rut = rut.replace('.','');

  	if (rut == '') {
  		this.service.logError(null,'Rut es requerido');
  	}
  	else if (password == '') {
  		this.service.logError(null,'Contraseña es requerido');
  	}
  	else {

  		this.loading = this.loadingController.create({content:'autentificando...'});
			this.loading.present();

			let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
			let options = new RequestOptions({ headers: headers });

	    this.http.post(global.api+'/login', {rut: rut, password: password}, options)
	    .map(res => res.json())
			.subscribe(
				data => this.processLogin(data,'ok'),
				err => this.processLogin(err,'err')
			);
  	}
  }

  private processLogin(obj,tipo) {
  	this.loading.dismiss();
  	if (tipo == 'ok') {
  		localStorage.setItem( "LipigasPersonas" , JSON.stringify(obj));
  		this.navCtrl.setRoot(Home);
  	}
  	else if (tipo == 'err') {
			if (obj.status == '401') { this.service.logError(obj, 'No fue posible acceder con el RUT y clave indicados'); }
			else { this.service.logError(obj); }
  	}
  }
}
