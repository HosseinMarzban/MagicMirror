import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,Platform,AlertController  } from 'ionic-angular';
import * as $ from 'jquery'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@IonicPage()
@Component({
  selector: 'page-module-chose',
  templateUrl: 'module-chose.html',
})
export class ModuleChosePage {

  public isAndroid: boolean = false;
  public qtd = {};
  public moduleList = [];
  public moduleChose = [];
  public t1 = [];
  public moduleAppend = [];
  public flag_addModule = true;
  public settings;

  constructor(private alertCtrl: AlertController,public http: Http,platform: Platform,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,) {
    //console.log( navParams.get('Param') )
    this.settings = JSON.parse( localStorage.getItem("ServerRemoteAddress"))
    this.isAndroid = platform.is('android');
    this.moduleList   = navParams.get('Param').data;
    this.moduleAppend = navParams.get('Param').postion;
    //clear moduleAppend
    //$('body .box_list_cardModule').toggleClass('animated flipInX')
    //this.t1 = this.moduleList[1];
    //console.log(this.t1)
  }

  alert( data:any ) {
    let alert = this.alertCtrl.create({
      title: data.title,
      subTitle: data.msg,
      buttons: [
        {
          text: 'Try Again',
          role: 'Dismiss',
          handler: () => {
            window.location.reload();
          }
        }
      ]
    });
    alert.present();
  } //@Function: alert()



  ionViewDidLoad() {
    console.log('ionViewDidLoad ModuleChosePage');
  } //@Function: ionViewDidLoad()

  dismiss() {
    let data = this.qtd;
    this.viewCtrl.dismiss(data);
  } //@Function: dismiss()


  moduleChoseChanged(_update = false,_moduleConf ){
    let ngModle = {}
    let  index = this.moduleList.findIndex(el => el.name==this.moduleChose);
    this.t1 = this.moduleList[index]
      this.t1['setting'].forEach(function(val, index){
        if(val.inputType != 'divided')
          ngModle[val.name] = Array.isArray(val.value) || val.inputType == 'boolean' ?  val.defualt :  val.value   ;
      });
    //FIXME:check without setTimeout
    setTimeout(() => {
      if(!_update)
        this.qtd = ngModle;
      else
        this.qtd = _moduleConf;
      console.log(this.qtd)
    },100);
  } //@Function: moduleChoseChanged()

  btn_delateModule(_module){
      let alert = this.alertCtrl.create({
        title: 'Remove Module '+_module.moduleName,
        message: 'Are you sure you want remove "'+_module.moduleName+'" Module from this location?',
        buttons: [
          {
            text: 'no',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'yes',
            handler: () => {
              console.log('Buy clicked');
              this.fn_removeModule(_module)
            }
          }
        ]
      });
      alert.present();
  } //@Function: btn_delateModule()

  fn_removeModule(_module){
    $('.moduleCarde').removeClass('animated  flipInX ').addClass('animated  flipOutX')
    this.http.post(`${this.settings["ipAddress"]}/removeModule`, { 'id': _module._id,'location':this.navParams.get('Param').location }).map(res => res.json()).subscribe(
          data => {
            console.log(data)
            if(data["is"]){
              //for animation
              setTimeout(() => {
                this.moduleAppend = [];
                this.moduleAppend = data['moduleList']
              }, 1000);
            }else{
              this.alert( {title:"Some things wrong happened", msg:data["msg"]})
            }
          },err => {
            //toast_error.present();
            this.alert( {title:"Server connection, Remove Module", msg:"We can not connect to server please check your connection with server then try again."})
          }
      );
  } //@Function: fn_removeModule()

  btn_visibilityChange(_module){
    $('.moduleCarde').removeClass('animated  flipInX ').addClass('animated  flipOutX')
    this.http.post(`${this.settings["ipAddress"]}/visibility`, { 'id': _module._id,'location':this.navParams.get('Param').location,'visibility':_module.visibility }).map(res => res.json()).subscribe(
        data => {
          console.log(data)
          if(data["is"]){
            //for animation
            setTimeout(() => {
              this.moduleAppend = [];
              this.moduleAppend = data['moduleList']
            }, 1000);
          }else{
            this.alert( {title:"Some things wrong happened", msg:data["msg"]})
          }
        },err => {
          this.alert( {title:"Server connection", msg:"We can not connect to server please check your connection with server then try again."})
        }
    );
  } //@Function: btn_visibilityChange()

  btn_addNweModule(){
    this.flag_addModule = true
    this.moduleChose = [];
    console.log(this.t1)
    this.t1.forEach(function(val,index){
      console.log(val)
      console.log(index)
    })
    console.log("akjsdlkja")
    $('.box_empty').addClass('animated fadeOut')
    $('.btn_addNewModule').addClass('animated zoomOutDown')
    $('.box_list_cardModule').addClass('animated zoomOutUp')

    setTimeout(() => {
      $('.box_list_cardModule,.box_empty ').hide()
      $('.box_addModule').fadeIn()
    }, 1000);
  } // @Function: btn_addNweModule()

  btn_addConfToLocation(_conf){
    if(this.flag_addModule){
      this.qtd["moduleName"] = this.moduleChose;
      this.qtd["postion"] = this.navParams.get('Param').location;
      this.qtd["visibility"] = true;
      //$('.moduleCarde').removeClass('animated  flipInX ').addClass('animated  flipOutX')
      this.http.post(`${this.settings["ipAddress"]}/addModule`, { "module" : this.qtd,'location':this.navParams.get('Param').location }).map(res => res.json()).subscribe(
          data => {
            console.log(data)
            if(data["is"]){
              //for animation
              console.log(data["msg"]);
              console.log(this.qtd);
              this.moduleAppend = [];
              this.moduleAppend = data['moduleList']
              this.t1 = [];
              this.qtd = [];
              $('.box_addModule').fadeOut('fast',function(){
                $('.box_list_cardModule').show()
                $('.btn_addNewModule,.box_list_cardModule').removeClass('animated zoomOutDown zoomOutUp')
                $('.btn_addNewModule,.box_list_cardModule').addClass('animated zoomInDown')
              });
            }else{
              this.alert( {title:"Some things wrong happened", msg:data["msg"]})
            }
          },err => {
            this.alert( {title:"Server connection, Add Module", msg:"We can not connect to server please check your connection with server then try again."})
          }
      );

    }else{
      this.http.post(`${this.settings["ipAddress"]}/updateModule`, { "module" : this.qtd,'location':this.navParams.get('Param').location }).map(res => res.json()).subscribe(
          data => {
            console.log(data)
            if(data["is"]){
              //for animation
              console.log(data["msg"]);
              console.log(this.qtd);
              this.moduleAppend = [];
              this.moduleAppend = data['moduleList']
              this.t1 = [];
              this.qtd = [];
              $('.box_addModule').fadeOut('fast',function(){
                $('.box_list_cardModule').show()
                $('.btn_addNewModule,.box_list_cardModule').removeClass('animated zoomOutDown zoomOutUp')
                $('.btn_addNewModule,.box_list_cardModule').addClass('animated zoomInDown')
              });
            }else{
              this.alert( {title:"Some things wrong happened", msg:data["msg"]});
            }
          },err => {
            this.alert( {title:"Server connection, Update Module", msg:"We can not connect to server please check your connection with server then try again."})
          }
      );
      
      this.flag_addModule = true;
    }//else condition

    
  } //@Function: btn_addNweModule()

  btn_setting(_event) {

    this.flag_addModule = false;
    let moduleConf = this.moduleAppend[$('.moduleCarde[data-index=' + _event + ']').attr('data-index')]
    this.moduleChose = this.moduleAppend[$('.moduleCarde[data-index=' + _event + ']').attr('data-index')].moduleName;
    this.moduleChoseChanged(true, moduleConf);
    $('.box_empty').addClass('animated fadeOut')
    $('.btn_addNewModule').addClass('animated zoomOutDown')
    $('.box_list_cardModule').addClass('animated zoomOutUp')
    setTimeout(() => {
      $('.box_list_cardModule,.box_empty ').hide()
      $('.box_addModule').fadeIn()
    }, 1000);
  } //@Function: btn_setting()


} //@Class: ModuleChosePage()


