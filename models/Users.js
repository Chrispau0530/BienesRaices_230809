import { DataTypes } from "sequelize";
import db from '../db/config.js'

const User = db.define('tbb_users', {
    name:{
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


})

export default User;