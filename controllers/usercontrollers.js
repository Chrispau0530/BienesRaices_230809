import User from "../models/Users.js"
import {check,validationResult} from "express-validator"
import {emailAfterRegistrer} from '../Helpers/email.js'
import {generatetId} from '../Helpers/tokens.js'
//import { where } from "sequelize"



const formularoLogin =(req,res) =>{
    res.render("auth/login",{
    page :'Formulario para el Login'
    })
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
    page :'Formulario de Recuperar contraseña'

    })
}





const createNewUser = async (req, res) => {

    //csrfToken:csrfToken()
    // Desestructurar los parámetros del request
    const { nombre_usuario, correo_usuario, password_usuario, password2_usuario } = req.body;

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
            token: generatetId()  // Puedes generar un token si lo necesitas
        });

        //Enviar email de confirmacion

        emailAfterRegistrer({
            name : usuario.name,
            email:usuario.email,
            token:usuario.token

        })

             // Mostrar mensaje de confirmación después de crear el usuario
        res.render("auth/login", {
            page: 'Cuenta Creada Correctamente',
            //msg: 'Hemos enviado un email de confirmación, presiona el enlace para confirmar tu cuenta.'
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
        usuario.confirmado = true;
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





 export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser,confirm}

