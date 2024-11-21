import User from "../models/Users.js"
import {check,validationResult} from "express-validator"
import {emailAfterRegistrer} from '../Helpers/email.js'
import {generatetId} from '../Helpers/tokens.js'



const formularoLogin =(req,response) =>{
    response.render("auth/login",{
    page :'Formulario para el Login'
    })
}

const formularioRegister = (req,response) =>{
    response.render("auth/createAccount",{
        page :'Crea una nueva cuenta'
      

    })
}

const formularioPasswordRecovery = (req,response) =>{
    response.render("auth/passwordRecovery",{
    page :'Formulario de Recuperar contraseña'

    })
}






const createNewUser = async (req,res) =>
    {
       //Validación de los campos que se reciben del formulario
       await check('nombre_usuario').notEmpty().withMessage("El nombre del usuario es un campo obligatorio.").run(req)
       await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extesion").run(req)
       await check('pass_usuario').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:8}).withMessage("La constraseña debe ser de almenos 8 carácteres.").run(req)
       await check("pass2_usuario").equals(req.body.pass_usuario).withMessage("La contraseña y su confirmación deben coincidir").run(req)

       let result = validationResult(req)
       
       //Verificamos si hay errores de validacion
       if(!result.isEmpty())
       {
           return response.render("auth/register", {
               page: 'Error al intentar crear la Cuenta de Usuario',
               errors: result.array(),
               user: {
                   name: req.body.nombre_usuario,
                   email: req.body.email
               }
           })
       }
       
       //Desestructurar los parametros del request
       const {nombre_usuario:name , correo_usuario:email, pass_usuario:password} = req.body

       //Verificar que el usuario no existe previamente en la bd
       const existingUser = await User.findOne({ where: { email}})

       console.log(existingUser);

       if(existingUser)
       { 
           return response.render("auth/register", {
           page: 'Error al intentar crear la Cuenta de Usuario',
           csrfToken: req.csrfToken(),
           errors: [{msg: `El usuario ${email} ya se encuentra registrado.` }],
           user: {
               name:name
           }
       })
       }
            
       /*console.log("Registrando a un nuevo usuario.")
       console.log(request.body);*/

       //Registramos los datos en la base de datos.
           const newUser = await User.create({
           name: req.body.nombre_usuario, 
           email: req.body.correo_usuario,
           password: req.body.pass_usuario,
           token: generatetId()
           }); 
           //response.json(newUser); 

       //Enviar el correo de confirmación
       emailAfterRegister({
           name: newUser.name,
           email: newUser.email,
           token: newUser.token 
       })


       response.render('templates/message', {
           csrfToken: request.csrfToken(),
           page: 'Cuenta creada satisfactoriamente.',
           msg: 'Hemos enviado un correo a : <poner el correo aqui>, para la confirmación se cuenta.'
       })
       
   }

   const confirm = async(request, response) => 
       {
           const {token } = request.params
           //validarToken - Si existe
           console.log(`Intentando confirmar la cuenta con el token: ${token}`)
           const userWithToken = await User.findOne({where: {token}});

           if(!userWithToken){
               response.render('auth/accountConfirmed', {
                   page: 'Error al confirmar tu cuenta.',
                   msg: 'El token no existe o ya ha sido utilizado, si ya has confirmado tu cuenta y aún no puedes ingresar, recupera tu contraseña aqui.',
                   error: true
               })
           }
           else
           {
               userWithToken.token=null
               userWithToken.confirmed=true;
               await userWithToken.save();

               response.render('auth/accountConfirmed', {
                   page: 'Excelente..!',
                   msg: 'Tu cuenta ha sido confirmada de manera exitosa.',
                   error: false
               })

           }
           
           
           //confirmar cuenta
           //enviar mensaje
  }

export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser,confirm}

