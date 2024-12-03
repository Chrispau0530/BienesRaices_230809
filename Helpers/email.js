import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const emailAfterRegistrer = async (newUserData) => { 
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, name, token } = newUserData;

    // Enviar el email 
    await transport.sendMail({
        from: 'bienes_raices_230809@example.com', // Asegúrate de usar una dirección de correo válida
        to: email,
        subject: 'Bienvenido/a al BienesRaices-230809',
        text: 'Ya casi puedes usar nuestra plataforma, solo falta confirmar tu cuenta.',
        html: `
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienes Raíces -Tu Hogar Ideal</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #2E626A;
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content h2 {
                        color: #333;
                        font-size: 20px;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                    }
                    .cta-button {
                        display: inline-block;
                        background-color: #75a9b1;
                        color: white;
                        padding: 10px 20px;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .footer {
                        background-color: #f4f4f4;
                        padding: 10px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                    }
                    .footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bienes Raíces 230809</h1>
                    </div>
                    <div class="content">
                        <h2>Encuentra Tu Hogar Ideal</h2>
                        <img src="http://localhost:3000/public/images/BIENES.png" alt="Descripción de la imagen" style="max-width: 100%; height: auto; border-radius: 8px;">

                        <p>Estimado/a ${name},</p>
                        <p>Estamos encantados de presentarte las mejores propiedades disponibles en nuestra cartera. Ya sea que estés buscando un hogar para tu familia, una inversión o un lugar de retiro, tenemos opciones que se adaptan a tus necesidades.</p>
                        <p>Pero solo para confirmar que si eres tú quien ingresó la cuenta, por favor haz clic en el siguiente enlace:</p>
                        <a href="${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/confirm/${token}" class="cta-button">Confirma tu cuenta</a>
                    </div>
                    <div class="footer">
                        <p>© 2024 Bienes Raíces 230809. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    });
}

const emailChangePassword = async(userData) =>{
const transport =nodemailer.createTransport({

host: process.env.EMAIL_HOST,
port: process.env.EMAIL_PORT,
auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
}

})


const {email,name,token} = userData
//Enviar email 
await transport.sendMail({
from : 'bienes_raices_230809',
to:email,
subject: 'Bienvenido/a al BienesRaices-230809',
 text: 'Ya casi puedes usar nuestra plataforma, solo falta confirmar tu cuenta.',
 html: `
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienes Raíces -Tu Hogar Ideal</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #2E626A;
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content h2 {
                        color: #333;
                        font-size: 20px;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                    }
                    .cta-button {
                        display: inline-block;
                        background-color: #75a9b1;
                        color: white;
                        padding: 10px 20px;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                    }
                    .footer {
                        background-color: #f4f4f4;
                        padding: 10px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                    }
                    .footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Bienes Raíces 230809</h1>
                    </div>
                    <div class="content">
                        <h2>Encuentra Tu Hogar Ideal</h2>
                        <img src="http://localhost:3000/public/images/BIENES.png" alt="Descripción de la imagen" style="max-width: 100%; height: auto; border-radius: 8px;">

                        <p>Estimado/a ${name},</p>
                        <p>Solicitud actualizada </p>
                        <p> Hola,  <span style="color: red"> ${name}</span>, <br>
        Haz reportado el olvido o perdida de tu contraseña para acceder a tu cuenta de BienesRaices.
        <br>
        <p>Por lo que necesitamos que  igreses a la siguiente liga para: <a href="${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}/auth/passwordRecovery/${token}">Actualizar Contraseña</a></p> 
        
    
                </div>
            </body>
            </html>
        `



})
    



}






export { emailAfterRegistrer,emailChangePassword};
