import { DataTypes } from "sequelize";
import db from '../db/config.js';
import bcrypt from 'bcrypt';

const User = db.define('tbb_users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password_confirmation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
}, {
    hooks: {
        beforeCreate: async function (user) {
            // Generar un salt
            const salt = await bcrypt.genSalt(10);

            // Hashear la contraseña principal y la de confirmación con el mismo salt
            user.password = await bcrypt.hash(user.password, salt);
         
        }
    }
});

export default User;
