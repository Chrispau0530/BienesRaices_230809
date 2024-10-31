// ECMA SCRIPT 6
//CommonJS

import express from 'express';
import generalRouters from './routes/generalRouters.js'
import userRouters from './routes/userRouters.js'
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
