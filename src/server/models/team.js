const connection = require('../database')
const { Model, DataTypes } = require('sequelize')
const User = require('./user')

class Team extends Model {}

Team.init({
  teamId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  abbreviation:{
    type: DataTypes.STRING(4),
    allowNull: false,
  },

  creatorUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'user'
      },
      key: 'userId'
    },
    allowNull: false
  },      

  numberOfPlayers:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  image: DataTypes.STRING
   
},
{
  sequelize: connection,
  modelName: 'Team',
  freezeTableName: true,
  timestamps: false,
})

Team.belongsTo(User);
