    //TODO: this file is part of next version and not ready yet

    let GlobalDB = {
        detected_divices:{}
    };
    

    
    var mqtt = require('mqtt')
    var client = mqtt.connect('mqtt://192.168.43.12',{keepalive:0}),pub_mqtt = mqtt.connect('mqtt://192.168.43.12');

    
    get_device_moduleConfig();
    
    
    
    let SmartModule = "";
    
    
    let serverList = ["http://127.2.0.1:3000","http://127.2.0.2:3000","http://127.2.0.3:3000","http://127.2.0.4:3000"]


    const request = async () => {

        for (const _ip of serverList) {
        const json = await fetch(_ip)
        .then(response => response.json());



            console.log(json);

        }

    }
    
    request();


   async function get_device_moduleConfig(){
    
        io.emit("SmartSensore",'SmartMosssssdasdasddule')
    
        //TODO: add retry to waite address and get data
       /*for (const _ip of serverList) {
            let ss =  request(_ip)
            console.log(ss)
        }*/
    }



  async function getAjax(_IP){
    
    /*return new Promise(async resolve=>{
        let response = await fetch(_IP);
        let json = await response.json();
        console.log(json);
        resolve('sss')
    })*/
        //setTimeout(()=>{resolve('true')},2000)

       /* $.ajax({
            url: _IP,
            method: "GET",
        }).done(function( msg ) {
            return new Promise( resolve=>{
                //alert( "Data Saved: " + msg );
                console.log(msg)
                resolve('true')

            })//promis
        }).fail(function( err ) {
            //alert( "Request failed: " + textStatus );
            console.log(err)

        });*/

            /*$.get( _IP, function( data ) {
                    console.log(data)
                    SmartModule = data
                    GlobalDB.detected_divices[`${data.id}`] = data
                    //GlobalDB.detected_divices.push(data)
                    // subscribe base on device configuration
                    data.in_out.forEach(element => {
                        client.subscribe(`${element.subscribe}`);
                        //Creat divices list
                        //GlobalDB.divices_event.push({"name":`${element.subscribe.toString()}`})
                    });
                    //setInterval(() => {
                        // console.log("MQTT Status:"+client.connected)
                        //get_message()
                        //console.log(GlobalDB)
                // }, 8000);
            });*///@Ajax:Get
    }
    
    
    function get_message(){
        client.reconnect()
        
        if(client.connected){
            client.on('message', function (topic, data) {
                let message = JSON.parse( data.toString() );
                //Update GlobalDB for access it all over the application

                GlobalDB.detected_divices[`${message.id}`].in_out.forEach(element =>{
                    if(message.name == element.subscribe.split('/')[2] ){
                        element['msg'] = message.msg
                    }
                });
                
            })
            client.end();
        }// if client mqtt connetcted 

        /*console.log(GlobalDB.detected_divices)
        for (var property in GlobalDB.detected_divices) {
            console.log(property)
            console.log(GlobalDB.detected_divices[property].name)
        }*/
        //console.log(GlobalDB)
        io.emit("SmartSensore",GlobalDB);
    }
    

    /*setInterval(()=>{
       // event_mqtt.publish('inTopic', 'dddddHsello Hossein');
    },6000)*/

   io.on('connection', function(socket){
        /*socket.on("mqtt_publish",function(_data){
            console.log('mqtt_publish');
            console.log(_data);
            client.reconnect()
            if(client.connected){
                event_mqtt.publish(_data.subscribe, _data.msg == "0" ? "1":"0");
            }  
        })*/
    })


    let mqtt_stack = [];

    io.on('connection', function(socket){

        socket.on("MQTT_Publish",(_data)=>{
            console.log(`MQTT_Publish, Data ${ JSON.parse( _data)}`);
            
            _data = JSON.parse(_data);
            //Reconnect to MQTT
            //client.reconnect();
            //if(client.connected){
                console.log(_data)
                pub_mqtt.publish(_data.subscribe, _data.msg == "0" ? "1":"0");
                setTimeout(() => {client.end();}, 1000);
            //}
        });

        
        socket.on("MQTT_Subscribe",(_data)=>{
            console.log(`MQTT_Subscribe, Data ${_data}`);
            //Reconnect to MQTT
            client.reconnect();
        });

    })// socket conncetion function





    function fn_mqttpublish (_data){
        if(client.connected){



            //after job done close connection.
            
        }// Condition Client connected.
    }//fn_mqttpublish




    // it must be here
    setTimeout(() => {client.end();}, 1000);





    client.on('message', function (topic, data) {

        

        if(client.connected){
           // let message = JSON.parse( data.toString() );
           // console.log(`${topic} => ${data}`);

                let message = JSON.parse( data.toString() );
                //Update GlobalDB for access it all over the application

                GlobalDB.detected_divices[`${message.id}`].in_out.forEach(element =>{
                    if(message.name == element.subscribe.split('/')[2] ){
                        element['msg'] = message.msg
                    }
                });
                

            //after job done close connection.
            client.end();

            console.log(GlobalDB)

            io.emit("SmartSensore",GlobalDB);
        }
        
    });




   /*setTimeout(() => {
        event_mqtt.publish('home/4$sd4d/plugin', '1');
    }, 10000);

    setTimeout(() => {
        event_mqtt.publish('home/4$sd4d/plugin', '0');
    }, 20000);*/
    
    /*setTimeout(() => {
        //console.log("-----------------------")
        //console.log(GlobalDB.smart_divices)
        //console.log("-----------------------")
    }, 20000);*/
    
    