const { findByPk } = require('../models/teamModel')
const team = require('../models/teamModel')

class TeamController {

  async createTeam(req, res) {
    const { body } = req

    const {
      name,
      abbreviation,
      creatorUserId,
      numberOfPlayers,
      image,
      UserUserId
    } = body

    const exists = await team.findOne({ where: { name } })

    if (exists) {
      return res.status(400).json({ message: `Já existe um time cadastrado com o nome: '${name}'.` })
    }

    const createdTeam = await team.create({
      name,
      abbreviation,
      creatorUserId,
      numberOfPlayers,
      image,
      UserUserId
    })

    return res.status(201).json({ createdTeam })
  }

  async updateTeam(req, res) {
    const { body } = req
    const { id } = req.params

    const {
      name,
      abbreviation,
      creatorUserId,
      numberOfPlayers,
      image,
      UserUserId
    } = body

    const exists = await team.findOne({ where: { name } })

    if (exists) {
      return res.status(400).json({ message: `Já existe um time cadastrado com o nome: '${name}'.` })
    }

    try {
      await team.update({
        name,
        abbreviation,
        creatorUserId,
        numberOfPlayers,
        image,
        UserUserId
      }, {
        where: { teamId: id }
      })

      return res.status(200).json({ message: 'Time atualizado com sucesso.' })

    } catch (err) {
      return res.status(500).json({ message: 'Não foi possível atualizar o time, tente novamente mais tarde.' })
    }
  }

  async getTeamById(req, res) {
    const { id } = req.params

    const findTeam = await team.findByPk(id)

    if (findTeam) {
      return res.status(200).json({ findTeam })
    } else {
      return res.status(404).json({ message: 'Erro ao buscar time, tente novamente mais tarde.' })
    }
  }

  async getAllTeams(req, res) {
    try {
      const allTeams = await team.findAll()

      return res.status(200).json({ allTeams })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar times.' })
    }
  }

  async deleteTeam(req, res) {
    const { id } = req.params

    try {
      const teamDeletionStatus = await team.destroy({ where: { teamId: id } })

      if (teamDeletionStatus)
        res.status(200).json({ message: 'Time removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar time.' })
    }
  }

}
module.exports = new TeamController