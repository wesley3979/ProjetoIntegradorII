const { Router } = require('express')
const routes = Router();
const userController = require('../controllers/userController');

routes.post('/', userController.createUser)
routes.post('/update/:id', userController.updateUser)
routes.get('/id/:id', userController.getUserById)
routes.get('/', userController.getAllUsers)
routes.delete("/delete/:id", userController.deleteUser)

module.exports = routes