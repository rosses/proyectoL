import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Noticia } from './Noticia';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as global from '../../global';

@Injectable()
export class NoticiaService{
  public perfil: any;
  public pag: any;

  constructor(private http : Http){
    this.perfil = JSON.parse(localStorage.getItem("LipigasPersonas"));
    this.pag = 1;
  }


  getAll(num: number): Observable<Noticia[]>{

    let noticia$ = this.http
      .get(`${global.api}/noticias?pag=`+num, {headers: this.getHeaders()})
      .map(mapNoticias)
      .catch(handleError);
      return noticia$;    

  }

  getAllFix(x,callback): any{
      let request = new XMLHttpRequest();

      request.open('GET', global.api+'/noticias');
      request.setRequestHeader('Content-Type', 'application/json');
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          callback.apply(x, [request.responseText]);
        }
      };
      let body = {
          'token':this.perfil.token,
          'pag':1,
      };
      request.send(JSON.stringify(body));
  }

  get(id: number): Observable<Noticia> {
    let noticia$ = this.http
      .get(`${global.api}/noticias/${id}`, {headers: this.getHeaders()})
      .map(mapNoticia);
      return noticia$;
  }

  save(noticia: Noticia) : Observable<Response>{
    // no aplica
    return this.http
      .put(`${global.api}/noticias/${noticia.id}`, JSON.stringify(noticia), {headers: this.getHeaders()});
  }

  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer '+this.perfil.token);
    return headers;
  }
}

function mapNoticias(response:Response): Noticia[]{
   return response.json().resultado.map(toNoticia)
}

function toNoticia(r:any): Noticia{
  let noticia = <Noticia>({
    id: r.idnoticia,
    titulo: r.titulo,
    imagen: r.imagen,
    fecha: r.fecha_publicacion,
    bajada: r.bajada,
    total_aplausos: r.total_aplausos,
    aplaudida: r.usuario_aplaudio,
    comentarios: r.total_comentarios,
    comments: '',
    contenido: ''
  });
  return noticia;
}

function toNoticiaExtended(r:any): Noticia{
  let noticia = <Noticia>({
    id: r.idnoticia,
    titulo: r.titulo,
    imagen: r.imagen,
    fecha: r.fecha_publicacion,
    bajada: r.bajada,
    total_aplausos: r.total_aplausos,
    aplaudida: r.usuario_aplaudio,
    comentarios: r.total_comentarios,
    comments: r.comentarios,
    contenido: r.contenido
  });
  return noticia;
}


function mapNoticia(response:Response): Noticia{
  return toNoticiaExtended(response.json());
}

function handleError (error: any) {
  let errorMsg = error.message || `Problemas al obtener información`
  console.error(errorMsg);
  return Observable.throw(errorMsg);
}