import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the EditarUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-usuario',
  templateUrl: 'editar-usuario.html',
})
export class EditarUsuarioPage {

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public toastCtrl: ToastController,
     public http: Http ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditarUsuarioPage');
  }

  private baseURL: string = "http://localhost/apiParaIONIC/api.php/";
  private IdUsuario: any = this.navParams.get("id");
  private nome: string = "";
  /**
    * Update an existing record that has been edited in the page's HTML form
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method editarUsuario
    * @param nome 			{String} 			nome value from form field
    * @return {None}
    */
  editarUsuario(): void {
    console.log(this.IdUsuario);
    console.log(this.nome);
    let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any = { "key": "editar", "nome": this.nome, "IdUsuario": this.IdUsuario },
      url: any = this.baseURL;

    this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data => {
        // If the request was successful notify the user
        //this.hideForm = true;
        this.sendNotification(data["_body"]);
      },
        (error: any) => {
          this.sendNotification('Não editado');
        });
  }

  /**
    * Manage notifying the user of the outcome of remote operations
    *
    * @public
    * @method sendNotification
    * @param message 	{String} 			Message to be displayed in the notification
    * @return {None}
    */
   sendNotification(message: string): void {
    let notification = this.toastCtrl.create({
       message: message,
       duration: 3000
    });
    notification.present();
 }

}
