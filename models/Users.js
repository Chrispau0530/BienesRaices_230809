import { DataTypes } from "sequelize";
import db from '../db/config.js'

const User = db.define('tbb_users',{
        name: {
        type:DataTypes.STRING(50),
        allowNull:false
    },email:{
        type:DataTypes.STRING(50),
        allowNull:false,
        unique:true
    },password:{
        type:DataTypes.STRING(50),
        allowNull:false,
    }, password_confirmation:{
        type:DataTypes.STRING(50),
        allowNull:false,
    },
    token: DataTypes.STRING(50),
    confirmed: DataTypes.BOOLEAN
},{
    hooks:{
        beforeCreate: async function(user)
        {
            //Generamos la clave para el hasheo, se recomiendan 10 rondas de aleatorización para no consumir demasiados recursos de hardware y hacer lento el proceso.
             const salt = await bcrypt.genSalt(10)  
             user.password = await bcrypt.hash(user.password, salt);
        }
}

})

export default User;