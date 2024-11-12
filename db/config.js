
import Sequelize from 'sequelize'

const db=new Sequelize ('bienes_raices_230809','Christian_Rodriguez','pass12345',{
host:"localhost",
port:3307,
dialect:'mysql',
define:{
    timestamps:true
},
pool:{
max :5,
min : 0,
acquire:30000,
idle:10000,
},

OperatorAliases:false


});

export default db;