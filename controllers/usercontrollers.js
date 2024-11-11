import User from "../models/Users.js"



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
console.log("Registro exitoso")
console.log(request.body);
//Registramoos los datos en la base de datos 
const newUser = await User.create({
    name:request.body.name,
    email :request.body.email,
    password:  request.body.password,
    password_confirmation: request.body.password_confirmation
})
response.json(newUser)  

}
export{formularoLogin,formularioRegister,formularioPasswordRecovery,createNewUser}

