import User from "../models/Users.js"
import { check,validationResult } from "express-validator"
import Usuario from "../models/Users.js"


const formularoLogin =(request,response) =>{
    response.render("auth/login",{
    auntenticado: false,
    page :'Formulario para el Login'
    })
}

const formularioRegister = (request,response) =>{
    response.render("auth/createAccount",{
        page :'Formulario de registro'

    })
}

const formularioPasswordRecovery = (request,response) =>{
    response.render("auth/passwordRecovery",{
    page :'Formulario de Recuperar contraseña'

    })
}






const createNewUser = async (request,response) =>{

await check('nombre').notEmpty().withMessage('EL Nombre no puede ir vacio ').run(request)
await check('correo-usuario').notEmpty().withMessage('Eso no parece un email').run(request)
await check('pass-usuario').isLength({min : 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(request)
await check ("pass2-usuario").equals(request.body.pass2-usuario).withMessage("La contraseña y su confirmacion deben de coincidir ").run(request)

 let resultado = validationResult(request)
 
 return res.json(resultado.aray())
 // Verificar que el resultado es vacio 
 if(!resultado.isEmpty()){
    //Errores
    return res.render('auth/createAccount',{
        page : 'Crear Cuenta',
        errores: resultado.array()
    })
 }
response.json(resultado.array())

console.log("Registro exitoso")
console.log(request.body);




//Registramoos los datos en la base de datos 
const newUser = await User.create({
    name:request.body.nombre,
    email:request.body.correo-usuario,
    password:request.bodu.pass-usuario,
    password_confirmation:request.body.pass2-usuario
})
response.json(newUser)  

}
export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser}

