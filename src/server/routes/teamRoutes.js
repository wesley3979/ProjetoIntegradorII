const { Router } = require('express')
const routes = Router();
const teamController = require('../controllers/teamController');

const checkToken = require('../helpers/check-token') //middleware

routes.post('/create', checkToken, teamController.createTeam)
routes.post('/update/:id', checkToken, teamController.updateTeam)
routes.get('/:id', checkToken, teamController.getTeamById)
routes.delete('/:teamid/user/:userid', checkToken, teamController.RemoveUserFromTeam)
routes.delete('/delete/:id', checkToken, teamController.deleteTeam)
routes.post('/user', checkToken, teamController.insertUserIntoTeam)
routes.get('/:id/users', checkToken, teamController.getAllUsersByTeamId)
routes.get('/:id/championship', checkToken, teamController.getChampionshipByTeamId)
routes.get('/:id/matches', checkToken, teamController.getMatchesByTeamId)
routes.get('/', checkToken, teamController.getAllTeams)


module.exports = routes