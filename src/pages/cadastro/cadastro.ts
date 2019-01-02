import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { EditarUsuarioPage } from '../editar-usuario/editar-usuario';

@Component({
   selector: 'page-cadastro',
   templateUrl: 'cadastro.html'
})

export class CadastroPage {
   /**
      * @nome form
      * @type {FormGroup}
      * @public
      * @description     Define FormGroup property for managing form validation / data retrieval
      */
   public form: FormGroup;

   /**
    * @nome technologynome
    * @type {Any}
    * @public
    * @description     Model for managing technologynome field
    */
   public technologynome: any;

   /**
    * @nome technologyDescription
    * @type {Any}
    * @public
    * @description     Model for managing technologyDescription field
    */
   public technologyDescription: any;

   /**
    * @nome isEdited
    * @type {Boolean}
    * @public
    * @description     Flag to be used for checking whether we are adding/editing an entry
    */
   public isEdited: boolean = false;

   /**
    * @nome hideForm
    * @type {Boolean}
    * @public
    * @description     Flag to hide the form upon successful completion of remote operation
    */
   public hideForm: boolean = false;

   /**
    * @nome pageTitle
    * @type {String}
    * @public
    * @description     Property to help set the page title
    */
   public pageTitle: string;

   /**
    * @nome IdUsuario
    * @type {String}
    * @public
    * @description     Property to store the IdUsuario for when an existing entry is being edited
    */
   public IdUsuario: any = null;

   /**
    * @nome baseURL
    * @type {String}
    * @public
    * @description Armazena o link do servidor
    */
   private baseURL: string = "http://localhost/apiParaIONIC/api.php/";
   private LeituraURL: string = "http://localhost/apiParaIONIC/apiLeitura.php/";

   data: any = {};
   public itens: Array<any> = [];

   // Initialise module classes
   constructor(public navCtrl: NavController,
      public http: Http,
      public NP: NavParams,
      public fb: FormBuilder,
      public toastCtrl: ToastController,
      public alertCtrl: AlertController ) {
      this.data.response = ""
      this.data.nome = ""
      //this.IdUsuario = ""
      // Create form builder validation rules
      this.form = fb.group({
         "nome": ["", Validators.required],
         "description": ["", Validators.required]
      });
   }

   /**
    * Triggered when template view is about to be entered
    * Determine whether we adding or editing a record
    * based on any supplied navigation parameters
    *
    * @public
    * @method ionViewWillEnter
    * @return {None}
    */
   ionViewWillEnter(): void {
      this.resetFields();

      //if (this.NP.get("record")) {
      //this.isEdited = true;
      this.carregarUsuarios();
      //this.selectEntry(this.NP.get("record"));
      //this.pageTitle = 'Amend entry';
      // }
      // else {
      //    this.isEdited = false;
      //    this.pageTitle = 'Create entry';
      // }
   }

   showConfirmAlert(item) {
      const confirm = this.alertCtrl.create({
         title: 'Excluir usuário permanentemente',
         message: 'Deseja excluir usuário?',
         buttons: [
           {
             text: 'Não',
             handler: () => {
               console.log('Não');
             }
           },
           {
             text: 'Sim',
             handler: () => {
               console.log('Sim');
               console.log(item);
              this.deletarUsuario(item);
             }
           }
         ]
       });
       confirm.present();
    }


    abrirParaEdicao(item){
      console.log("abrir" + item);
      console.log("abrir" + item.id);
      this.navCtrl.push(EditarUsuarioPage, { id: item.id });
    }

   /**
    * Assign the navigation retrieved data to properties
    * used as models on the page's HTML form
    *
    * @public
    * @method selectEntry
    * @param item 		{any} 			Navigation data
    * @return {None}
    */
   //    selectEntry(item: any): void {
   // console.log(this.data.nome);
   // console.log(this.IdUsuario);


   //       this.data.nome = item.nome;
   //       this.IdUsuario = item.id;
   //    }

   /**
    * Save a new record that has been added to the page's HTML form
    * Use angular's http post method to submit the record data
    *
    * @public
    * @method cadastrar
    * @param nome 			{String} 			nome value from form field
    * @param description 	{String} 			Description value from form field
    * @return {None}
    */
   cadastrar(): void {
      console.log(this.data.nome);
      if (this.data.nome == "") {
         this.sendNotification("Não deixe o campo nome em branco!!");
      }
      else {
         let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { "key": "cadastrar", "nome": this.data.nome },
            url: any = this.baseURL + "manage-data.php";

         this.http.post(url, JSON.stringify(options), headers)
            .subscribe((data: any) => {
               this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
               // Usuário tem um feedback da ação de tentar inserir usuário
               this.hideForm = true;
               this.sendNotification(this.data.response = data["_body"]);
            },
               (error: any) => {
                  this.sendNotification('Something went wrong!');
               });
         this.carregarUsuarios()
      }
   }
   /**
    * Update an existing record that has been edited in the page's HTML form
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method updateEntry
    * @param nome 			{String} 			nome value from form field
    * @param description 	{String} 			Description value from form field
    * @return {None}
    */
   updateEntry(nome: string, description: string): void {
      let headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
         options: any = { "key": "update", "nome": nome, "description": description, "IdUsuario": this.IdUsuario },
         url: any = this.baseURL + "manage-data.php";

      this.http
         .post(url, JSON.stringify(options), headers)
         .subscribe(data => {
            // If the request was successful notify the user
            this.hideForm = true;
            this.sendNotification(`Congratulations the technology: ${nome} was successfully updated`);
         },
            (error: any) => {
               this.sendNotification('Something went wrong!');
            });
   }

   /**
    * Remove an existing record that has been selected in the page's HTML form
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method deletarUsuario
    * @return {None}
    */
   deletarUsuario(item): void {
      this.IdUsuario = item.id;
      console.log(this.IdUsuario);
      let nome: string = this.form.controls["nome"].value,
         headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
         options: any = { "key": "deletar", "IdUsuario": this.IdUsuario },
         url: any = this.baseURL;

      this.http
         .post(url, JSON.stringify(options), headers)
         .subscribe(data => {
            this.hideForm = true;
            //this.sendNotification(`O usuário: ${nome} foi deletado`);
            this.sendNotification(this.data.response = data["_body"]);
         },
            (error: any) => {
               this.sendNotification('Não deletado');
            });
      this.carregarUsuarios();
   }

   carregarUsuarios(): void {
      this.http
         .get(this.LeituraURL)
         .subscribe((data: any) => {
            //console.log(data["_body"].nome);
            console.dir(data);
            //const retorno = data;
            this.itens = JSON.parse(data._body);
            console.log("itens");
            console.log(this.itens.length);
            for (let i = 0; i <= this.itens.length; i++) {
               console.log(this.itens[i]);
            }
         },
            (error: any) => {
               console.dir(error);
            });
   }

   /**
    * Handle data submitted from the page's HTML form
    * Determine whether we are adding a new record or amending an
    * existing record
    *
    * @public
    * @method saveEntry
    * @return {None}
    */
   // saveEntry() : void
   // {
   //    let nome          : string = this.form.controls["nome"].value,
   //        description   : string    = this.form.controls["description"].value;

   //    if(this.isEdited)
   //    {
   //       this.updateEntry(nome, description);
   //    }
   //    else
   //    {
   //       this.cadastrar(nome);
   //    }
   // }

   /**
    * Clear values in the page's HTML form fields
    *
    * @public
    * @method resetFields
    * @return {None}
    */
   resetFields(): void {
      this.technologynome = "";
      this.technologyDescription = "";
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

   teste() {
      console.log("teste");
   }

   teste2() {
      console.log("teste2");
   }
}