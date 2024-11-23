import express from 'express';
import generalRouters from './routes/generalRouters.js';
import userRouters from './routes/userRouters.js';
import db from './db/config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';

dotenv.config({ path: '.env' });

const app = express();

// Habilitar lectura de datos de formulario POST
app.use(express.urlencoded({ extended: true }));

// Habilitar Pug 
app.set('view engine', 'pug');
app.set('views', './views');

// Carpeta pública
app.use(express.static('public'));

// Habilitar Cookie Parser
app.use(cookieParser());

// Habilitar CSRF después de Cookie Parser y antes de las rutas
app.use(csrf({ cookie: true }));

// Middleware para pasar el token CSRF a las vistas
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

// Routing
app.use('/', generalRouters);
app.use('/auth', userRouters);

// Conexión a la base de datos
try {
    await db.authenticate(); // Verifica las credenciales del usuario 
    await db.sync(); // Crea la base de datos y las tablas si no existen
    console.log('Conexión con la base de datos establecida');
} catch (error) {
    console.log(error);
}

// Configuración del servidor
const port = process.env.BACKEND_PORT || 3000;
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});
