const { Router } = require('express')
const routes = Router();
const championshipController = require('../controllers/championshipController')

const checkToken = require('../helpers/check-token') //middleware

routes.post('/create', checkToken, championshipController.createChampionship)
routes.get('/:id', checkToken, championshipController.getInfosChampionshipById)
routes.delete('/delete/:id', checkToken, championshipController.deleteChampionshipById)
routes.get('/:id/matches', checkToken, championshipController.getMatchesByChaphioshipId)
routes.post('/:idchampionship/matches/:idmatch', checkToken, championshipController.updateMatch)
routes.post('/:id/update', checkToken, championshipController.updateChampionship)
routes.post('/:id/start', checkToken, championshipController.startChampionship)
routes.get('/', checkToken, championshipController.getInfosAllChampionship)

module.exports = routes