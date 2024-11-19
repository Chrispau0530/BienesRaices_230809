import User from "../models/Users.js"
import { check,validationResult } from "express-validator"
//import {generatetId} from '../models/Helpers/tokens.js'
//import {token} from  'graphq1'



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
    const { nombre_usuario, correo_usuario, password_usuario } = request.body;
    //Verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({ where: { email: correo_usuario } });
    console.log(existingUser);
    if(existingUser)
    {
        return response.render("auth/register", {
            page: "Error al intentar crear la cuenta de Usuario",
            errors: [{msg: `El usuario ${correo_usuario} ya se encuentra registrado`}],
            user: {
                name: nombre_usuario
            }
        })
    }
    console.log("Registrando a un nuevo usuario.");
    console.log(request.body);
    //Validación de los campos que se reciben del formulario







await check('nombre_usuario').notEmpty().withMessage('EL Nombre no puede ir vacio ').run(request)
await check('correo_usuario').notEmpty().withMessage('Eso no parece un email').run(request)
await check('pass_usuario').isLength({min : 6}).withMessage('El Password debe ser de al menos 6 caracteres').run(request)
await check ("pass2_usuario").equals(request.body.pass2_usuario).withMessage("La contraseña y su confirmacion deben de coincidir ").run(request)

 let resultado = validationResult(request)
 
 //return res.json(resultado.aray())



 // Verificar que el resultado es vacio 
 if(!resultado.isEmpty()){
    //Errores
    return res.render('auth/createAccount',{
        page : 'Crear Cuenta',
        errores: resultado.array()
    })
 }else{


console.log("Registro exitoso")
console.log(request.body);
 }



//Registramoos los datos en la base de datos 
const newUser = await User.create({
    name:request.body.nombre_usuario,
    email:request.body.correo_usuario,
    password:request.body.pass_usuario,
    password_confirmation:request.body.pass2_usuario,
});
response.json(newUser)  

return;
}





//Almacenar el usuario 

await User.create({
    name,
    email : correo_usuario,
    password : pass_usuario,
    password_confirmation: pass2_usuario,
    token: generatetId()   
  })


export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser}

