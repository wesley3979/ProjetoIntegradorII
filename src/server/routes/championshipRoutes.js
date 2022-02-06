const { Router } = require('express')
const routes = Router();
const championshipController = require('../controllers/championshipController')

const checkToken = require('../helpers/check-token') //middleware

routes.post('/create', checkToken, championshipController.createChampionship)
routes.get('/:id', checkToken, championshipController.getInfosChampionshipById)
routes.delete('/delete/:id', checkToken, championshipController.deleteChampionshipById)
routes.get('/:id/matches', checkToken, championshipController.getMatchesByChaphioshipId)
routes.post('/:idchampionship/:idmatch', checkToken, championshipController.updateMatchByAdminChampionship)
routes.get('/', checkToken, championshipController.getInfosAllChampionship)

module.exports = routes