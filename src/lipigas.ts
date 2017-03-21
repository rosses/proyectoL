import {Injectable} from '@angular/core'
import { AlertController } from 'ionic-angular';

@Injectable()
export class Lipigas {
  
  public p: any;
  constructor(public alertCtrl: AlertController) {

  }
  
  logError(o: any, msg?: string) {
    if (!msg) { msg = 'Ocurrio un error al procesar su solicitud. Intente más tarde'; }
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  	if (o !== null) { console.log(o); }
  }
  showMsg(msg: string) {
    let alert = this.alertCtrl.create({
      title: '',
      cssClass: 'alertSuccess',
      subTitle: msg,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  showDater(msg: string) {
    let alert = this.alertCtrl.create({
      title: '',
      cssClass: 'alertSuccess',
      subTitle: '<h3>Activar Lipipuntos</h3>Selecciona la fecha y horario<br /><br /><input type="date" #fechaSolicitud />&nbsp;<img src="assets/icon/solicitar.blue.png" />&nbsp;<select #horaSolicitud><option value="AM">AM</option><option value="PM">PM</option></select><br /><br /><button class="shadow" ion-button (click)="postSolicitar(fechaSolicitud.value, horaSolicitud.value);">Solicitar</button><button class="shadow" ion-button (click)="closePopup();">Cancelar</button>',
      buttons: ['Aceptar']
    });
    alert.present();
  }




}