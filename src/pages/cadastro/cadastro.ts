import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';

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
   public form : FormGroup;

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
   public technologyDescription  : any;

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
    * @nome recordID
    * @type {String}
    * @public
    * @description     Property to store the recordID for when an existing entry is being edited
    */
   public recordID: any      = null;

   /**
    * @nome baseURI
    * @type {String}
    * @public
    * @description     Remote URI for retrieving data from and sending data to
    */
   private baseURI: string  = "http://localhost/apiParaIONIC/api.php/";

   data:any = {};

   // Initialise module classes
   constructor(public navCtrl    : NavController,
               public http       : Http,
               public NP         : NavParams,
               public fb         : FormBuilder,
               public toastCtrl  : ToastController)
   {
      this.data.response = "";
      
      // Create form builder validation rules
      this.form = fb.group({
         "nome"                  : ["", Validators.required],
         "description"           : ["", Validators.required]
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
   ionViewWillEnter() : void
   {
      this.resetFields();

      if(this.NP.get("record"))
      {
         this.isEdited      = true;
         this.selectEntry(this.NP.get("record"));
         this.pageTitle     = 'Amend entry';
      }
      else
      {
         this.isEdited      = false;
         this.pageTitle     = 'Create entry';
      }
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
   selectEntry(item : any) : void
   {
      this.technologynome        = item.nome;
      this.technologyDescription = item.description;
      this.recordID              = item.id;
   }

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
   cadastrar(nome : string) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "Cadastro", "nome" : nome},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http.post(url, JSON.stringify(options), headers)
      .subscribe((data : any) =>
      {
         this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
         // If the request was successful notify the user
         this.hideForm   = true;
         this.sendNotification(`O nome: ${nome} foi adicionado`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
      });
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
   updateEntry(nome : string, description : string) : void
   {
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "update", "nome" : nome, "description" : description, "recordID" : this.recordID},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         // If the request was successful notify the user
         this.hideForm  =  true;
         this.sendNotification(`Congratulations the technology: ${nome} was successfully updated`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
      });
   }

   /**
    * Remove an existing record that has been selected in the page's HTML form
    * Use angular's http post method to submit the record data
    * to our remote PHP script
    *
    * @public
    * @method deleteEntry
    * @return {None}
    */
   deleteEntry() : void
   {
      let nome      : string 	= this.form.controls["nome"].value,
          headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "delete", "recordID" : this.recordID},
          url       : any      	= this.baseURI + "manage-data.php";

      this.http
      .post(url, JSON.stringify(options), headers)
      .subscribe(data =>
      {
         this.hideForm     = true;
         this.sendNotification(`Congratulations the technology: ${nome} was successfully deleted`);
      },
      (error : any) =>
      {
         this.sendNotification('Something went wrong!');
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
   saveEntry() : void
   {
      let nome          : string = this.form.controls["nome"].value,
          description   : string    = this.form.controls["description"].value;

      if(this.isEdited)
      {
         this.updateEntry(nome, description);
      }
      else
      {
         this.cadastrar(nome);
      }
   }

   /**
    * Clear values in the page's HTML form fields
    *
    * @public
    * @method resetFields
    * @return {None}
    */
   resetFields() : void
   {
      this.technologynome           = "";
      this.technologyDescription    = "";
   }

   /**
    * Manage notifying the user of the outcome of remote operations
    *
    * @public
    * @method sendNotification
    * @param message 	{String} 			Message to be displayed in the notification
    * @return {None}
    */
   sendNotification(message : string)  : void
   {
      let notification = this.toastCtrl.create({
          message       : message,
          duration      : 3000
      });
      notification.present();
   }

}