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





const createNewUser = async (req, res) => {
    // Desestructurar los parámetros del request
    const { nombre_usuario, correo_usuario, password_usuario, password2_usuario } = req.body;

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

    // Verificación si hay errores de validaciones
    let result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render("auth/createAccount", {
            page: 'Error al intentar crear la Cuenta de Usuario',
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
            errors: [{ msg: `El usuario ${correo_usuario} ya se encuentra registrado` }],
            user: { name: req.body.nombre_usuario, email: req.body.correo_usuario }
        });
    }

    // Almacenar un Usuario después de las validaciones
    try {
        await User.create({
            name: nombre_usuario,
            email: correo_usuario,
            password: password_usuario,  // La contraseña será hasheada en el hook
            token: generatetId()  // Puedes generar un token si lo necesitas
        });


             // Mostrar mensaje de confirmación después de crear el usuario
        res.render('templates/message', {
            pagina: 'Cuenta Creada Correctamente',
            mensaje: 'Hemos enviado un email de confirmación, presiona el enlace para confirmar tu cuenta.'
        });


        // Redirigir o mostrar un mensaje de éxito
      //  res.redirect('/login'); // O la ruta que elijas para redirigir
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.render("auth/createAccount", {
            page: "Error al crear la cuenta",
            errors: [{ msg: "Hubo un error al registrar el usuario." }]
        });
    }
   
}




export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser}

