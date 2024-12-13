import User from "../models/Users.js"
import {check,validationResult} from "express-validator"
import {emailAfterRegistrer,emailChangePassword} from '../Helpers/email.js'
import {generatetId} from '../Helpers/tokens.js'
import { where } from "sequelize"
import { response } from "express"
//import { where } from "sequelize"



const formularoLogin =(req,res) =>{
    res.render("auth/login",{
    page :'Formulario para el Login',
    csrfToken: req.csrfToken()

    })
}
const authenticateUser =async (req,res)=>{
//Validar que la cuenta existe 
//Validar que el correo y la cuenta coincida en la bd
// si-PAGINA PRINCIPAL
//NO-Mostrar mensaje de error 

const userExist = await User.findOne({where:{email:correo_usuario}})
if(!userExist){
    return response.render("auth/createAccount",{
        page : 'Login',
        errors: [{msg:`No hay un usuario asociado al correo ${email}`}],
        csrfToken: req.csrfToken()
        

    })
}
}


const formularioRegister = (req,res) =>{
    //console.log(req.csrfToken());
    res.render("auth/createAccount",{
        page :'Crea una nueva cuenta',
       csrfToken: req.csrfToken()
    })
}

const formularioPasswordRecovery = (req,res) =>{
    res.render("auth/passwordRecovery",{
    page :'Formulario de Recuperar contraseña',
    csrfToken: req.csrfToken()

    })
}



function esMayorDeEdad(fechaNacimiento) {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();

    // Calcular la edad
    let edad = hoy.getFullYear() - fechaNac.getFullYear();

    // Ajustar si el cumpleaños no ha ocurrido este año
    if (
        hoy.getMonth() < fechaNac.getMonth() ||
        (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())
    ) {
        edad--;
    }

    return edad >= 18;
}




const createNewUser = async (req, res) => {

    //csrfToken:csrfToken()
    // Desestructurar los parámetros del request
    const { nombre_usuario, correo_usuario, password_usuario, password2_usuario,fecha_usuario } = req.body;

    // Validación de los campos que se reciben del formulario
    await check('nombre_usuario')
        .notEmpty().withMessage( "🔙El nombre del usuario es un campo obligatorio.")
        .run(req);
    await check('correo_usuario')
        .notEmpty().withMessage("‼️ El correo electrónico es un campo obligatorio.")
        .isEmail().withMessage("😫Debe ingresar un correo electrónico válido.")
        .run(req);
    await check('password_usuario')
        .notEmpty().withMessage("☢️La contraseña es un campo obligatorio.")
        .isLength({ min: 8 }).withMessage("🔕La contraseña debe ser de al menos 8 caracteres.")
        .run(req);
    await check('password2_usuario')
        .equals(req.body.password_usuario).withMessage("📛La contraseña y su confirmación deben coincidir.")
        .run(req);
        await check('fecha_usuario').notEmpty().withMessage(" 😞 No puede ir vacio tu fecha de nacimiento").run(req)

    // Verificación si hay errores de validaciones
    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/createAccount", {
            page: 'Error al intentar crear la Cuenta de Usuario',
           csrfToken : req.csrfToken(),
            errors: result.array(),
            User: {
                name: req.body.nombre_usuario,
                email: req.body.correo_usuario
            }
        });
    }


       // Verificar si el usuario es mayor de edad
       if (!esMayorDeEdad(fecha_usuario)) {
        return res.render("auth/createAccount", {
            page: "Error al intentar crear la cuenta de Usuario",
            csrfToken: req.csrfToken(),
            errors: [{ msg: `El usuario ${nombre_usuario} no es mayor de edad.` }],
            user: { name: nombre_usuario, email: correo_usuario }
        });
    }

    // Verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({ where: { email: correo_usuario } });
    if (existingUser) {
        return res.render("auth/createAccount", {
            page: "Error al intentar crear la cuenta de Usuario",
          csrfToken : req.csrfToken(),
            errors: [{ msg: `El usuario ${correo_usuario} ya se encuentra registrado` }],
            user: { name: req.body.nombre_usuario, email: req.body.correo_usuario }
        });
    }



  
      

    // Almacenar un Usuario después de las validaciones
    try {
        const usuario = await User.create({
            name: nombre_usuario,
            email: correo_usuario,
            password: password_usuario,  // La contraseña será hasheada en el hook
            fecha_nacimiento:fecha_usuario,
            token: generatetId()  // Puedes generar un token si lo necesitas
        });

        //Enviar email de confirmacion

        emailAfterRegistrer({
            name : usuario.name,
            email:usuario.email,
            token:usuario.token

        })

             // Mostrar mensaje de confirmación después de crear el usuario
           res.render('../views/templates/message', {
            page: 'Cuenta Creada Correctamente',
            msg: 'Hemos enviado un email de confirmación, presiona el enlace para confirmar tu cuenta.'
        });


        

        // Redirigir o mostrar un mensaje de éxito
      //  res.redirect('/login'); // O la ruta que elijas para redirigir
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.render("auth/createAccount", {
           csrfToken : req.csrfToken(),
            page: "Error al crear la cuenta",
            errors: [{ msg: "Hubo un error al registrar el usuario." }]
        });
    }



   
}
// Función que comprueba una cuenta
const confirm = async (req, res) => {
    
    
    const { token } = req.params;

    try {
        // Verificar si el token es válido
        const usuario = await User.findOne({ where: { token } });

        if (!usuario) {
            return res.render('auth/accountConfirmed', {
                page: 'Error al confirmar tu cuenta',
                msg: 'Hubo un error al confirmar',
                error: true
            });
        }

        // Confirmar la cuenta: actualizar usuario
        usuario.token = null;
        usuario.confirmed  = true;
        await usuario.save();

        // Mostrar mensaje de éxito
        res.render('auth/accountConfirmed', {
            page: 'Cuenta confirmada',
            msg: 'La cuenta se confirmó correctamente',
            error: false
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un error en el servidor');
    }


    
};


const passwordRest = async (req,res) => {

    await check('correo_usuario')
        .notEmpty().withMessage("‼️ El correo electrónico es un campo obligatorio.")
        .isEmail().withMessage("😫Debe ingresar un correo electrónico válido.")
        .run(req);



    // Verificación si hay errores de validaciones
    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/passwordRecovery", {
            page: 'Error al intentar rastrear cuenta la contraseña ',
            csrfToken : req.csrfToken(),
            errors: result.array(),
            
        });
    }
 



    //Desestructuramos parametros
    const {correo_usuario} = req.body

       

    // Verificar que el usuario no existe previamente en la bd
    const existingUser = await User.findOne({ where: {email:correo_usuario,confirmed:1} });
    console.log(User)
    if (!existingUser) {
        return res.render("auth/passwordRecovery", {
          page: "Error no existe una cuenta asociada al correo electronico ingresado",
             csrfToken : req.csrfToken(),
            errors: [{ msg: `Por favor revisa los datos e intentalo de nuevo` }],
            User: {  email: req.body.correo_usuario }
        });
    }   
    console.log("El usuario si existe en la bsd")

    //Registramos los datos en la base de datos 



    existingUser.password="";
    existingUser.token= generatetId();
    existingUser.save();
  

//Enviar el correo de confirmación
 emailChangePassword({
    name: existingUser.name,
    email: existingUser.email,
    token: existingUser.token   
})


res.render('../views/templates/message', {
    csrfToken: req.csrfToken(),
    page: 'Solicitud de actualización de contraseña aceptada',
    msg: `Hemos enviado un correo a : ${correo_usuario}, para la la actualización de tu contraseña.`
})


}


const verifyTokenPasswordChange =async(req, res)=>{

const {token} = req.params;
const userTokenOwner = await User.findOne({where :{token}})

if(!userTokenOwner)
    { 
        res.render('../views/templates/message', {
            csrfToken: req.csrfToken(),
            page: 'Error',
            msg: 'El token ha expirado o no existe.'
        })
    }

 

res.render('auth/reset-password', {
    csrfToken: req.csrfToken(),
    page: 'Restablece tu password',
    msg: 'Por favor ingresa tu nueva contraseña'
})
}

 const updatePassword = async(request, response)=>{
    const {token}= request.params

    //Validar campos de contraseñas
    await check('password_usuario_new').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:8}).withMessage("La constraseña debe ser de almenos 8 carácteres.").run(request)
    await check('confirm_new_password').equals(request.body.password_usuario_new).withMessage("La contraseña y su confirmación deben coincidir").run(request)

    let result = validationResult(request)

    if(!result.isEmpty())
        {
            return response.render("auth/reset-password", {
                page: 'Error al intentar crear la Cuenta de Usuario',
                errors: result.array(),
                csrfToken: request.csrfToken(),
                token: token
            })
        }

    //Actualizar en BD el pass 
    const userTokenOwner = await User.findOne({where: {token}}) 
    userTokenOwner.password=request.body.password_usuario_new
    userTokenOwner.token=null;
    userTokenOwner.save();  // update tb_users set password=new_pasword where token=token;

    //Renderizar la respuesta
    response.render('auth/accountConfirmed', {
        page: 'Excelente..!',
        msg: 'Tu contraseña ha sido confirmada de manera exitosa.',
        error: false
    })

}



const userAuthentication =  async(request, response) =>
    {

        const {correo_usuario:email , pass_usuario:password} = request.body;

        console.log(`El usuario esta intentando acceder con las credenciles usuario: ${email} y la constraseña: ${password}...`)

        // Validar datos desde front
        await check('correo_usuario').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extesion").run(request)

        await check('pass_usuario').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({min:8}).withMessage("La constraseña debe ser de almenos 8 carácteres.").run(request)
        
        let result = validationResult(request)
    
        //Verificamos si hay errores de validacion
        if(!result.isEmpty())
        {
            return response.render("auth/login", {
                page: 'Login',
                errors: result.array(),
                csrfToken: request.csrfToken()
            })
        }   

        // revisar que exista la cuenta
        const existingUser = await User.findOne({where:{email}})
        // revisar quee la cuenta y la contraseña coincidan con la bd

        if(!existingUser)
        {
            return response.render("auth/login", {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{msg: `Error, no existe una cuenta asociada a este correo.` }],
                                
            })
        }

        // Verificar que la cuenta este confirmada
        
        if(!existingUser.confirmed)
        {
            return response.render("auth/login", {
                page: 'Login',
                csrfToken: request.csrfToken(),
                errors: [{msg: `Por favor revisa tu correo electrónico y confirma tu cuenta.` }],
                                
            })
        }
        else{

            if(!existingUser.passwordVerify(password))
            {
                return response.render("auth/login", {
                    page: 'Login',
                    csrfToken: request.csrfToken(),
                    errors: [{msg: `La contraseña es incorrecta.` }],
                                    
                })
            }else{
                 return response.render('../views/templates/message', {
                    csrfToken: request.csrfToken(),
                    page: 'Exelente',
                    msg: `Bienvenido  ${email}, esta es la pagina principal de bienes raices `  
                })
        
            }
        }
        

        //    Si - Renderizar el index
        //    No - Mostrar errores

        return 0;

    }





 export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser,confirm,passwordRest,updatePassword,verifyTokenPasswordChange,authenticateUser}

 