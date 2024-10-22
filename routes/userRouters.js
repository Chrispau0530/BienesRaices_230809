import express from 'express';

const router = express.Router();

//GET
router.get("/busquedaPorID/:id",function(request,response){
    response.send(`Se esta solicitando buscar al usuario por ID : ${request.params.id}`)  // 2 COMPONENTES QUE TIENE UNA PETICION  (ruta y fusion callback)
})    
//POST

//put

//Patch











export default router;