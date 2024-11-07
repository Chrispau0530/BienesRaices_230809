
const formularoLogin =(request,response) =>{
    response.render("auth/login",{
    auntenticado: false,
    page :'Login'
    })
}

const formularioRegister = (request,response) =>{
    response.render("auth/createAccount",{
        page :'Formulario de registro'

    })
}

const formularioPasswordRecovery = (request,response) =>{
    response.render("auth/passwordRecovery",{
    page :'Recuperar contraseña'

    })
}

export{formularoLogin,formularioRegister,formularioPasswordRecovery}

