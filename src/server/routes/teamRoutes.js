const { Router } = require('express')
const routes = Router();
const teamController = require('../controllers/teamController');

routes.post('/create', teamController.createTeam)
routes.post('/update/:id', teamController.updateTeam)
routes.get('/:id', teamController.getTeamById)
routes.get('/', teamController.getAllTeams)
routes.delete("/delete/:id", teamController.deleteTeam)

module.exports = routes