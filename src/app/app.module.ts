import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule} from '@angular/http';

//import { Camera } from '@ionic-native/streaming-media';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { EditarUsuarioPageModule } from '../pages/editar-usuario/editar-usuario.module';
 

@NgModule({
 declarations: [
 MyApp,
 HomePage,
 CadastroPage
 ],
 imports: [
 BrowserModule,
 IonicModule.forRoot(MyApp),
 HttpModule,
 EditarUsuarioPageModule
 ],
 bootstrap: [IonicApp],
 entryComponents: [
 MyApp,
 HomePage,
 CadastroPage
 ],
 providers: [
 StatusBar,
 SplashScreen,
 //Camera,
 {provide: ErrorHandler, useClass: IonicErrorHandler}
 ]
})
export class AppModule {}