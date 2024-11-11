// ECMA SCRIPT 6
//CommonJS

import express from 'express';
import generalRouters from './routes/generalRouters.js'
import userRouters from './routes/userRouters.js'
import confing from './db/config.js'
// const express = require ()
const app = express();
// configuramos nuestro servidor web

const port = 3000;
app.listen(port , ()=> {
    console.log(`La aplicacion ha iniciado en el puerto : ${port}`);
});

//Routing - ENRUTAMIENTO.
//app.use('/',generalRouters);
app.use('/auth',userRouters);
//Probamos las rutas para poder presentar mensajes al usuario a traes del navegador

//Habilitar pug 
app.set('view engine' , 'pug')
app.set('views', './views')

//Carpeta Publica 
app.use(express.static('public'))



try{
    await db.authenticate(); //Verifica las credenciales del usuario 
    db.sync(); //Se crea la base de datos si no existe, y se crea la tabla si no existe 
    console.log('Conexion con la base de datos establecida');
}catch(error){
    confingig.error(error);
}

//Habilitar la lectura de los datos del formulario por el metodo POST

app.use(express.urlencoded({encoded: true}))