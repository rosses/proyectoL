import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { LipigasPersonas } from './app.component';
import { Lipigas } from '../lipigas';
import { VerNoticia } from '../pages/vernoticia/vernoticia';
import { Cumpleanos } from '../pages/cumpleanos/cumpleanos';
import { VerPersona } from '../pages/verpersona/verpersona';
import { SolicitarPuntos } from '../pages/solicitarpuntos/solicitarpuntos';
import { AprobarPuntos } from '../pages/aprobarpuntos/aprobarpuntos';
import { NoticiasComponent } from '../pages/noticias/noticias';
import { Login } from '../pages/login/login';
import { Perfil } from '../pages/perfil/perfil';
import { PasswordPerdida } from '../pages/passwordperdida/passwordperdida';
import { Home } from '../pages/home/home';

@NgModule({
  declarations: [
    LipigasPersonas,
    NoticiasComponent,
    VerNoticia,
    Cumpleanos,
    VerPersona,
    AprobarPuntos,
    SolicitarPuntos,
    Login,
    Home,
    Perfil,
    PasswordPerdida
  ],
  imports: [
    IonicModule.forRoot(LipigasPersonas, {
      backButtonText: ''
     })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LipigasPersonas,
    NoticiasComponent,
    SolicitarPuntos,
    AprobarPuntos,
    VerNoticia,
    Cumpleanos,
    VerPersona,
    Login,
    Home,
    Perfil,
    PasswordPerdida
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Lipigas]
})
export class AppModule {}
