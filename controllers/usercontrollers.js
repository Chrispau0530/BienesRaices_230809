import User from "../models/Users.js"
import {check,validationResult} from "express-validator"
import {emailAfterRegistrer} from '../Helpers/email.js'
import {generatetId} from '../Helpers/tokens.js'



const formularoLogin =(req,res) =>{
    res.render("auth/login",{
    page :'Formulario para el Login'
    })
}

const formularioRegister = (req,res) =>{
    res.render("auth/createAccount",{
        page :'Crea una nueva cuenta'
      

    })
}

const formularioPasswordRecovery = (req,res) =>{
    res.render("auth/passwordRecovery",{
    page :'Formulario de Recuperar contraseña'

    })
}








const createNewUser = async (req,res) =>
    {
        
            // Desestructurar los parámetros del request
         const { nombre_usuario, correo_usuario, password_usuario } = req.body;
     
         // Verificar que el usuario no existe previamente en la bd
         const existingUser = await User.findOne({ where: { email: correo_usuario } });
     
         if (existingUser) {
             return res.render("auth/createAccount", {
                 page: "Error al intentar crear la cuenta de Usuario",
                 errors: [{ msg: `El usuario ${correo_usuario} ya se encuentra registrado` }],
                 user: { name: req.body.nombre_usuario , email : req.body.correo_usuario }  // Use nombre_usuario here
             });
         }
     
         //console.log("Registrando a un nuevo usuario.");
         //console.log(req.body);

         //Almacenar un Usuario 
            await User.create({
            name:nombre_usuario,
            email:correo_usuario,
            password:password_usuario,
            token:123


         })








     
         // Validación de los campos que se reciben del formulario
         await check('nombre_usuario')
             .notEmpty().withMessage("El nombre del usuario es un campo obligatorio.")
             .run(req);
         await check('correo_usuario')
             .notEmpty().withMessage("El correo electrónico es un campo obligatorio.")
             .isEmail().withMessage("Debe ingresar un correo electrónico válido.")
             .run(req);
         await check('password_usuario')
             .notEmpty().withMessage("La contraseña es un campo obligatorio.")
             .isLength({ min: 8 }).withMessage("La contraseña debe ser de al menos 8 caracteres.")
             .run(req);
         await check('password2_usuario')
             .equals(req.body.password_usuario).withMessage("La contraseña y su confirmación deben coincidir.")
             .run(req);
     
         let result = validationResult(req);
     
         // Verificación si hay errores de validaciones
         if (!result.isEmpty()) {
             return res.render("auth/createAccount", {
                 page: 'Error al intentar crear la Cuenta de Usuario',
                 errors: result.array(),
                 User :{
                    name: req.body.nombre_usuario,
                    email : req.body.correo_usuario
                 }
             });
         } else {
             console.log("Registrando a nuevo usuario");
             console.log(req.body);
         }
      




         // Registro a los datos en la base de datos.
         //const newUser = await User.create({
          //   name: nombre_usuario,  // Use nombre_usuario here
            //   email: correo_usuario,
            //password: password_usuario,
           //  password_confirmation:password2_usuario
            // token: generatetId()   // Generate token here
//         });
     
  }

export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser}

