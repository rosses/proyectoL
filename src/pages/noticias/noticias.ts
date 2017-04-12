import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {GoogleAnalytics} from 'ionic-native';
import { Component, OnInit } from '@angular/core';
import { Noticia } from './noticia';
import { Http, Headers, RequestOptions } from '@angular/http';
import { VerNoticia } from '../../pages/vernoticia/vernoticia';
import { NoticiaService } from './noticia.service';
import * as global from '../../global';
import { Lipigas } from '../../lipigas';

@Component({
  selector: 'noticias',
  templateUrl: 'noticias.html',
  providers: [Lipigas]
})
export class NoticiasComponent implements OnInit{
  noticia: Noticia;
  noticias: Noticia[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;
  isGeneral: boolean = true;
  public id: any = null;
  loading: any;
  perfil: any;
  num: number;
  p: any;
  public maxpag: number = 0;
  public hasMoreData: boolean = true;

  constructor( private noticiaService : NoticiaService, public navCtrl: NavController, public params: NavParams, public loadingController: LoadingController, public http: Http, private service: Lipigas ) { 
    this.id = params.get("id");
    this.num = 1;
    if (this.id != null) {
      this.isGeneral = false;
    }
    this.perfil = JSON.parse(localStorage.getItem("LipigasPersonas"));
    GoogleAnalytics.trackView("Noticias");
  }

  ngOnInit(){
      this.noticiaService
        .getAll(this.num)
        .subscribe(
            p => this.noticias = p,
            e => this.errorMessage = e,
            () => this.isLoading = false);
  }


  goToNews(id: number) {
    this.navCtrl.push(VerNoticia,{
      id: id
    });
  }


  private headers() {
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+this.perfil.token);
      let options = new RequestOptions({ headers: headers });
      return options;
  }

  aplausoDar(id: number, index: number) {
    this.loading = this.loadingController.create();
    this.loading.present();
    this.http.post(global.api+'/aplaudir', {id: id, tipo: 'noticia'}, this.headers())
    .map(res => res.json())
    .subscribe(
      data => this.processAplausoDar(data,'ok',index),
      err => this.processAplausoDar(err,'err',index)
    );
  }

  private processAplausoDar(obj,tipo,i) {
    this.loading.dismiss();
    if (tipo == 'ok') { this.noticias[i].aplaudida = 1; this.noticias[i].total_aplausos = obj.total_aplausos; }
    else if (tipo == 'err') { this.service.logError(obj, 'No fue posible aplaudir esta noticia, por favor intente nuevamente'); }
  }

  aplausoQuitar(id: number, index: number) {
    this.loading = this.loadingController.create();
    this.loading.present();
    this.http.post(global.api+'/desaplaudir', {id: id, tipo: 'noticia'}, this.headers())
    .map(res => res.json())
    .subscribe(
      data => this.processAplausoQuitar(data,'ok',index),
      err => this.processAplausoQuitar(err,'err',index)
    );
  }
  private processAplausoQuitar(obj,tipo,i) {
    this.loading.dismiss();
    if (tipo == 'ok') { this.noticias[i].aplaudida = 0; this.noticias[i].total_aplausos = obj.total_aplausos; }
    else if (tipo == 'err') { this.service.logError(obj, 'No fue posible aplaudir esta noticia, por favor intente nuevamente'); }
  }

  doInfinite(infiniteScroll) {
    this.num = this.num+1;
    //console.log(this.maxpag);
    //if (this.num > this.maxpag) { this.hasMoreData = false; }
    setTimeout(() => {
      this.noticiaService
        .getAll(this.num)
        .subscribe(
            p => {
              this.p = p;
              [].push.apply(this.noticias, p);
            },
            e => this.errorMessage = e,
            () => infiniteScroll.complete());
    }, 500);
  }

}
