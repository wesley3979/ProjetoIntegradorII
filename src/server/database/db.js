(async () => {
  const connection = require('./index')
  const User = require('../models/user')
  await connection.sync()
})()