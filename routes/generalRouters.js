import express from 'express';
const router = express.Router();

router.get("/",function(req,res){
    res.send("Hola Mundo desde Node, a traves del Navegador");
})

router.get("/QuienSoy",function(req,res){
    res.json({"Estudiante" : "Christian Paul Rodriguez Perez",
        "Grado": "4",
        "Grupo": "B",
        "Carrera" : "DSM"

});

});


export default router// Esta palabra reservada de JS me permite exportar los elementos definifos y utilizarlos en otros archivos del mismo sitio