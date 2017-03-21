import { Component, Injector } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Lipigas } from '../../lipigas';
import { Home } from '../home/home';
import { Http, Headers, RequestOptions } from '@angular/http';
import {Camera} from 'ionic-native';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as global from '../../global';

@Component({
  selector: 'perfil',
  templateUrl: 'perfil.html',
  providers: [Lipigas]
})
export class Perfil {
  public perfil: any;
  public login: any;
  public loading: any;
  public popupSetPasswordHidden: boolean = true;
  public popupSetUpdateHidden: boolean = true;
  public popupSetImage: boolean = true;
  public overlayHidden: boolean = true;
  public base64Image: string;
  public fonoEnable: boolean = false;
  public movilEnable: boolean = false;
  public emailEnable: boolean = false;
  public googleEnable: boolean = false;
  public skipeEnable: boolean = false;

  constructor(public navCtrl: NavController, public http: Http, private service: Lipigas, public loadingController: LoadingController, public actionSheetCtrl: ActionSheetController) {

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
      "telefono_movil": "",
      "skype": "",
      "google_id": "",
      "descripcion": "",
      "qr": ""
    }
    this.loading = this.loadingController.create({content:'recuperando datos...'});
    this.loading.present();


    let headers = new Headers();
    headers.append('Authorization', 'Bearer '+this.login.token);
    //headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.get(global.api+'/perfil/'+this.login.rut, {headers: headers})
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
      this.base64Image = this.perfil.avatar;
    }
    else if (res == 'err') {
      this.service.logError(obj, 'No fue posible recuperar tu perfil. Revisa que tu conexión a internet esté disponible.');
    }
  }

  setPasword(password1: String, password2: String) {

    if (password1 == '') {
      this.service.logError(null,'Nueva clave no puede ser vacía');
    }
    else if (password1 != password2) {
      this.service.logError(null,'No coinciden las claves, por favor revísalas');
    }
    else {

      this.loading = this.loadingController.create({content:'actualizando...'});
      this.loading.present();

      let headers = new Headers();
      headers.append('Authorization', 'Bearer '+this.login.token);
      
      this.http.put(global.api+'/perfil/password', {token: this.perfil.token, contrasena: password1, recontrasena: password2}, {headers:headers})
      .map(res => res.json())
      .subscribe(
        data => this.processUpdatePassword(data,'ok'),
        err => this.processUpdatePassword(err,'err')
      );
      
    }
  }

  private processUpdatePassword(obj,tipo) {
    this.loading.dismiss();
    if (tipo == 'ok' && obj.mensaje == 'OK') {
      this.service.showMsg('Contraseña actualizada con éxito');
      this.login.token = obj.token;
      localStorage.setItem("LipigasPersonas", JSON.stringify(this.login));
    }
    else if (tipo == 'err') {
      this.service.logError(obj);
    }
  }

  private openGallery (): void {

    this.processGallery('http://138.197.196.64:3000/assets/uploads/f6add4a3-dd91-473f-8286-daec78970bc8.jpg');
    /*
    let cameraOptions = {
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,      
      quality: 60,
      targetWidth: 320,
      targetHeight: 320,
      encodingType: Camera.EncodingType.JPEG,      
      correctOrientation: true
    }

    Camera.getPicture(cameraOptions)
      .then(file_uri => this.processGallery(file_uri), 
      err => console.log(err));
    */
  }

  public processGallery(uri) {

    this.base64Image = uri;

    this.loading = this.loadingController.create({content:'actualizando...'});
    this.loading.present();   

    var canvas : any = document.getElementById("mycanvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = uri;
    
    ctx.drawImage(img, 10, 10);

    var blob = this.dataURItoBlob(canvas.toDataURL());

    var objURL = window.URL.createObjectURL(blob);
    var image = new Image();
    image.src = objURL;
    window.URL.revokeObjectURL(objURL);

    var formData = new FormData();
    formData.append('avatar', blob, 'avataruser.jpg');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', global.api+'/perfil/avatar');
    xhr.setRequestHeader("Authorization", 'Bearer '+this.login.token);
    xhr.send(formData);

    var self = this;

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          self.loading.dismiss();
          if (json.mensaje == 'OK') {
              self.perfil.avatar = json.avatar;
              self.login.avatar = json.avatar;
              localStorage.setItem("LipigasPersonas", JSON.stringify(self.login));
              self.service.showMsg('Foto actualizada con éxito');
          }
          else {
             self.service.logError(json, 'Error al procesar la solicitud. Inténtelo más tarde.');
          }
        }
    };
  }

  private dataURItoBlob(dataURI) {
    var byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = (dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
      type: mimeString
    });
  }


  public updateme(email: string, oficina: string, movil: string, skype: string, google: string) {
  
    this.loading = this.loadingController.create({content:'guardando...'});
    this.loading.present(); 

    if (email == "") { email = " "; }
    if (oficina == "") { oficina = " "; }
    if (movil == "") { movil = " "; }
    if (skype == "") { skype = " "; }
    if (google == "") { google = " "; }


    this.perfil.email = email;
    this.perfil.telefono_oficina = oficina;
    this.perfil.telefono_movil = movil;
    this.perfil.skype = skype;
    this.perfil.google = email;

    let headers = new Headers();
    headers.append('Authorization', 'Bearer '+this.login.token);
    
    this.http.put(global.api+'/perfil', {token: this.perfil.token, email: email, telefono_oficina: oficina, telefono_movil: movil, skype: skype, google_id: google, descripcion: ''}, {headers:headers})
    .map(res => res.json())
    .subscribe(
      data => this.processUpdatePerfil(data,'ok'),
      err => this.processUpdatePerfil(err,'err')
    );
  }
  public processUpdatePerfil(obj: any,res: any) {
    this.loading.dismiss();
    if (obj.mensaje == 'OK') {
        this.service.showMsg('Datos actualizados con éxito');
        this.fonoEnable = false;
        this.movilEnable = false;
        this.emailEnable = false;
        this.googleEnable = false;
        this.skipeEnable = false;
    }
    else {
       this.service.logError(obj, 'Error al procesar la solicitud. Inténtelo más tarde.');
    }
  }



  public closePopup() {
    this.popupSetPasswordHidden = true;
    this.popupSetUpdateHidden = true;
    this.popupSetImage = true;
    this.overlayHidden = true;
  }
  public takePicture() {
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 320,
        targetHeight: 320
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.processTake(imageData);
    }, (err) => {
        console.log(err);
    });
  }

  public processTake(imageData) {
    this.base64Image = "data:image/jpeg;base64," + imageData;

    this.loading = this.loadingController.create({content:'actualizando...'});
    this.loading.present();   

    var blob = this.dataURItoBlob(this.base64Image);

    var objURL = window.URL.createObjectURL(blob);
    var image = new Image();
    image.src = objURL;
    window.URL.revokeObjectURL(objURL);

    var formData = new FormData();
    formData.append('avatar', blob, 'avataruser.jpg');

    var xhr = new XMLHttpRequest();
    xhr.open('POST', global.api+'/perfil/avatar');
    xhr.setRequestHeader("Authorization", 'Bearer '+this.login.token);
    xhr.send(formData);

    var self = this;

    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          self.loading.dismiss();
          if (json.mensaje == 'OK') {
              self.perfil.avatar = json.avatar;
              self.login.avatar = json.avatar;
              localStorage.setItem("LipigasPersonas", JSON.stringify(self.login));
              //self.navCtrl.nav.perfil = JSON.parse(localStorage.getItem("LipigasPersonas"));
              self.service.showMsg('Foto actualizada con éxito');
          }
          else {
             self.service.logError(json, 'Error al procesar la solicitud. Inténtelo más tarde.');
          }
        }
    };

  }

  public changeProfileImg() {
      let actionSheet = this.actionSheetCtrl.create({
      title: 'Cambiar foto de perfil',
      buttons: [
        {
          text: 'Tomar foto', 
          handler: () => {
            this.takePicture();
          }
        },{
          text: 'Elegir del álbum',
          handler: () => {
            this.openGallery();
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado subir foto');
          }
        }
      ]
    });
    actionSheet.present();
  }
  public movilEnableFn() { if (this.movilEnable) { this.movilEnable = false; } else { this.movilEnable = true; } }
  public fonoEnableFn() { if (this.fonoEnable) { this.fonoEnable = false; } else { this.fonoEnable = true; } }
  public googleEnableFn() { if (this.googleEnable) { this.googleEnable = false; } else { this.googleEnable = true; } }
  public skipeEnableFn() { if (this.skipeEnable) { this.movilEnable = false; } else { this.skipeEnable = true; } }
  public emailEnableFn() { if (this.emailEnable) { this.emailEnable = false; } else { this.emailEnable = true; } }

}

