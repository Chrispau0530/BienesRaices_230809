// ECMA SCRIPT 6
//CommonJS

import express from 'express';

// const express = require ()
const app = express();
// configuramos nuestro servidot wev

const port = 3000;
app.listen(port , ()=> {
    console.log(`La aplicacion ha iniciado en el puerto : ${port}`);
});