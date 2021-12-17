const user = require('./user')

const routes = (app) => {
  app.use('/user', user)
}
module.exports = routes;