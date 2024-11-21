// ECMA SCRIPT 6
//CommonJS

import express from 'express';
import generalRouters from './routes/generalRouters.js'
import userRouters from './routes/userRouters.js'
import db from './db/config.js'
import dotenv from 'dotenv';
import csrf from 'csurf'
import cookieParser from 'cookie-parser'


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




// Habilitar Cookie Parser 
app.use(cookieParser())

// Habilitar CSRF
app.use(csrf({cookie: true})) 

//Habilitar pug 
app.set('view engine' , 'pug')
app.set('views', './views')

//Carpeta Publica 
app.use(express.static('public'))


//Habilitar la lectura de los datos del formulario por el metodo POST

app.use(express.urlencoded({encoded:true}))
//Conexion a la base de datos 
try{
    await db.authenticate(); //Verifica las credenciales del usuario 
    db.sync(); //Se crea la base de datos si no existe, y se crea la tabla si no existe 
    console.log('Conexion con la base de datos establecida');
}catch(error){
    console.log(error);
}
