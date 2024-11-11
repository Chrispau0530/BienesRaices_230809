import express from 'express';

const router = express.Router();

import {formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser} from '../controllers/usercontrollers.js';




//GET - Se utiliza  para la lectura de datos e informacion del servidor al cliente 
//EndPoints - S on las rutas para acceder a las secciones o funciones de nuestra apliacacion web // 2. componentes de una peticion ruta ( a donde voy) funcion callback ( que hago)
// ":" en una ruta definen de manera posicional los parametros de entrada 
router.get("/busquedaPorID/:id",function(request,response){
    response.send(`Se esta solicitando buscar al usuario por ID : ${request.params.id}`)  // 2 COMPONENTES QUE TIENE UNA PETICION  (ruta y fusion callback)
})     
//POST - Se utiliza para el envio de datos e informacion al cliente servidor 
router.post("/newUser ",createNewUser)
//Put actualizacion completa 
//PUT- Se utiliza para la actualizacion total de la informacion del cliente servidor 
//a =  requeste y response = b , pide y devuelve el dato el servidor 
router.put("/replaceemail/:name/:email/:newEmail/:password",function(a,b){
    b.send(`Se ha solicitado el remplazo de toda la informacion del usuario : ${a.params.name} con correo : ${a.params.email} y contraseña : ${a.params.password}` )
})


//Patch
//Patch solo modifica propiedades del objeto existente 
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm",function(request,response){
  const {email,newPassword,newPasswordConfirm} = request.params //Desestructuracion de un objeto 
  
  if(newPassword === newPasswordConfirm){
    response.send(`Se ha solicitado el acutualizacion de la contraseña del usuario con correo : ${email}, se aceptan los cambios ya que la contraseña y confirmacion son la misma.`)
    console.log(newPassword);
    console.log(newPasswordConfirm); 

}else{
    response.send(`Se ha solicitado la acutualizacion de la contraseña del usuario con correo : ${email} con la nueva contraseña ${newPassword} , pero se rechaza el cambio dado que la nueva contraseña y su confirmacion no coinciden`)
    console.log(newPassword);
    console.log(newPasswordConfirm);

}



})


//DELETE - Se utiliza para el borrado de la informacion del cliente al servidor

router.delete("/deleteUser/:email",function(request,response){
        response.send(`Se ha solicitado el borrado del usuario con correo : ${request.params.email}`)
})

// Exportar el router para poder usarlo en el archivo principaL

router.get("/login",formularoLogin /*middleware : es cuando le damos la tarea a alguien */ )
router.get("/createAccount",formularioRegister)
router.get("/passwordRecovery",formularioPasswordRecovery)







export default router;