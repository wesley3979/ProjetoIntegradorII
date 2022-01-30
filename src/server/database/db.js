(async () => {
  const connection = require('./index')
  const User = require('../models/userModel')
  const Team = require('../models/teamModel')
  await connection.sync()
})()