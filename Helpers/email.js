import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path:'.env'})

const emailAfterRegistrer = async(newUserData) =>{ 
const transport =nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }

})

//console.log( data)
const {email,name,token} = newUserData

//Enviar el email 
await transport.sendMail({
    from:'bienes_raices_230809',
    to: email,
subject: 'Bienvenido/a al BienesRaices-230809',
text: 'Ya casi puedes usar nuestra plataforma, solo falta confirmar tu cuenta.',
html: `
    <p>¡Hola <span style="color: red;">${name}</span>!</p>
    <p>
        Bienvenido/a a la plataforma de BienesRaices, el sitio seguro donde podrás buscar, comprar 
        y ofertar propiedades a través de internet.
    </p>
    <br>
    <p>
        Ya solo necesitamos que confirmes la cuenta que creaste, dando click en la siguiente 
        liga: 
        <a href="${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/confirm/${token}" 
        style="text-decoration: none; color: blue;">Confirmar cuenta</a>.
    </p>
    <br>
`


})
}

export  {emailAfterRegistrer}