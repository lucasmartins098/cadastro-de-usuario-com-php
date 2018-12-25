import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http'; //https://stackoverflow.com/questions/43609853/angular-4-and-ionic-3-no-provider-for-http
 
@Component({
 selector: 'page-cadastro',
 templateUrl: 'cadastro.html'
})
 
export class CadastroPage {
 data:any = {};
 
 constructor(public navCtrl: NavController, public http: Http) {
 this.data.nome = '';
 this.data.response = '';
 this.http = http;
 }
 
 cadastrar() {
 var link = 'http://localhost/apiparaionic/api.php';
 var myData = JSON.stringify({nome: this.data.nome});
 
 this.http.post(link, myData)
 .subscribe(data => {
 this.data.response = data["_body"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
 this.data.nome = data["_nome"]; //https://stackoverflow.com/questions/39574305/property-body-does-not-exist-on-type-response
}, error => {
 console.log("Oooops!");
 });
 }
}