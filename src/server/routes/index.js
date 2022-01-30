const user = require('./userRoutes')
const team = require('./teamRoutes')

const routes = (app) => {
  app.use('/user', user)
  app.use('/team', team)
}
module.exports = routes;