import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { NoticiasComponent } from '../../pages/noticias/noticias';
import { Noticia } from '../../pages/noticias/noticia';
import { NoticiaService } from '../../pages/noticias/noticia.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { VerPersona } from '../../pages/verpersona/verpersona';

import * as global from '../../global';
import { Lipigas } from '../../lipigas';

@Component({
  selector: 'vernoticia',
  templateUrl: 'vernoticia.html',
  providers: [Lipigas]
})

export class VerNoticia implements OnInit{
  noticia: Noticia;
  errorMessage: string = '';
  isLoading: boolean = true;
  public id: any = null;
  public loading: any;
  public perfil: any;
  public msg : any;
  newsContent : SafeUrl;


  constructor( private noticiaService : NoticiaService, public navCtrl: NavController, public params: NavParams, private service: Lipigas, public loadingController: LoadingController, public http: Http, private sanitizer: DomSanitizer ) { 
    this.perfil = JSON.parse(localStorage.getItem("LipigasPersonas"));
    this.id = params.get("id");
  }

  ngOnInit(){

      this.noticiaService
        .get(this.id)
        .subscribe(
            p => this.noticia = p,
            e => this.errorMessage = e,
            () => this.isLoading = false);

  }

  goToPeople(rut: string) {
    this.navCtrl.push(VerPersona,{
      rut: rut
    });
  }
  public goNews() {
   this.navCtrl.setRoot(NoticiasComponent, {}, { animate: true, direction: 'back' });
  }

  aplausoDar() {
    this.loading = this.loadingController.create();
    this.loading.present();
    this.http.post(global.api+'/aplaudir', {id: this.id, tipo: 'noticia'}, this.headers())
    .map(res => res.json())
    .subscribe(
      data => this.processAplausoDar(data,'ok'),
      err => this.processAplausoDar(err,'err')
    );
  }

  private processAplausoDar(obj,tipo) {
    this.loading.dismiss();
    if (tipo == 'ok') { this.noticia.aplaudida = 1; this.noticia.total_aplausos = obj.total_aplausos; }
    else if (tipo == 'err') { this.service.logError(obj, 'No fue posible aplaudir esta noticia, por favor intente nuevamente'); }
  }

  aplausoQuitar() {
    this.loading = this.loadingController.create();
    this.loading.present();
    this.http.post(global.api+'/desaplaudir', {id: this.id, tipo: 'noticia'}, this.headers())
    .map(res => res.json())
    .subscribe(
      data => this.processAplausoQuitar(data,'ok'),
      err => this.processAplausoQuitar(err,'err')
    );
  }
  private processAplausoQuitar(obj,tipo) {
    this.loading.dismiss();
    if (tipo == 'ok') { this.noticia.aplaudida = 0; this.noticia.total_aplausos = obj.total_aplausos; }
    else if (tipo == 'err') { this.service.logError(obj, 'No fue posible aplaudir esta noticia, por favor intente nuevamente'); }
  }

  comentar() {
    if (this.msg.length <= 1) {
      this.service.logError(null,'Tu comentario debe ser más largo');
    }
    else {
      this.loading = this.loadingController.create({content:'comentando...'});
      this.loading.present();
      this.http.post(global.api+'/comentarios', {id: this.id, tipo: 'noticia', comentario: this.msg}, this.headers())
      .map(res => res.json())
      .subscribe(
        data => this.processPost(data,'ok'),
        err => this.processPost(err,'err')
      );
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

  private processPost(obj,tipo) {
    this.loading.dismiss();
    if (tipo == 'ok') {
      this.msg = '';
      this.noticia.comments = obj.resultado;
      this.noticia.comentarios = obj.resultado.length;
    }
    else if (tipo == 'err') {
      this.service.logError(obj, 'No fue posible dejar el comentario, por favor intente nuevamente'); 
    }
  }

}
