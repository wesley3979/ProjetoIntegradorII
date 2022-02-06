const { Op } = require("sequelize");
const { findByPk } = require('../models/teamModel')
const Team = require('../models/teamModel')
const User = require('../models/userModel')
const Championship = require('../models/championshipModel')
const Match = require('../models/matchModel')



class TeamController {

  async createTeam(req, res) {
    try {

      const { body } = req

      const {
        name,
        abbreviation,
        creatorUserId,
        numberOfPlayers,
        image,
        UserId
      } = body

      const exists = await Team.findOne({ where: { name } })

      if (exists) {
        return res.status(400).json({ message: `Já existe um time cadastrado com o nome: '${name}'.` })
      }

      const createdTeam = await Team.create({
        name,
        abbreviation,
        creatorUserId,
        numberOfPlayers,
        image,
        UserId
      })

      return res.status(201).json({ createdTeam })
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao criar time, tente novamente mais tarde.' })
    }
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
      UserId
    } = body

    const exists = await Team.findOne({ where: { name } })

    if (exists) {
      return res.status(400).json({ message: `Já existe um time cadastrado com o nome: '${name}'.` })
    }

    try {
      await Team.update({
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

    const findTeam = await Team.findByPk(id)

    if (findTeam) {
      return res.status(200).json({ findTeam })
    } else {
      return res.status(404).json({ message: 'Erro ao buscar time, tente novamente mais tarde.' })
    }
  }

  async getAllTeams(req, res) {
    try {
      const allTeams = await Team.findAll()

      return res.status(200).json({ allTeams })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar times.' })
    }
  }

  async deleteTeam(req, res) {
    const { id } = req.params

    try {
      const teamDeletionStatus = await Team.destroy({ where: { teamId: id } })

      if (teamDeletionStatus)
        return res.status(200).json({ message: 'Time removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar time.' })
    }
  }

  async insertUserIntoTeam(req, res) {
    try {

      const { body } = req

      const {
        UserId,
        TeamId
      } = body

      const user = await User.findByPk(UserId)
      if (user) user.password = undefined

      if (!user) {
        return res.status(400).json({ message: 'Erro ao inserir jogador em equipe, pois o usuário informado não existe.' })
      }

      const team = await Team.findByPk(TeamId)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao inserir jogador em equipe, pois a equipe informada não existe.' })
      }

      const result = await user.addTeam([team])

      if (result)
        return res.status(201).json({ message: 'Usuário inserido no time', user, team })
      else
        return res.status(400).json({ message: 'Erro: o usuário informado já está cadastrado nessa equipe.', user, team })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao inserir jogador em equipe, tente novamente mais tarde.', err })
    }
  }

  async getAllUsersByTeamId(req, res) {
    try {
      const { id } = req.params

      let result = await Team.findByPk(id, {
        include: User
      })
      if (result) result.password = undefined

      return res.status(200).json({ result })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao selecionar jogadores, tente novamente mais tarde.' })
    }
  }

  async RemoveUserFromTeam(req, res) {
    try {

      const { userid, teamid } = req.params
      const token = getToken(req)
      const validateTokenWithUserId = await getUserByToken(token)
      if (validateTokenWithUserId) {
        if (validateTokenWithUserId.userId != userid) {
          return res.status(401).json({ message: `O token informado não corresponde ao Id dos parâmetros` })
        }
      }
      else return res.status(401).json({ message: `O token informado não corresponde a nenhum usuário` })

      const user = await User.findByPk(userid)

      if (!user) {
        return res.status(400).json({ message: 'Erro ao remover jogador da equipe, pois o usuário informado não existe.' })
      }

      const team = await Team.findByPk(teamid)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao remover jogador da equipe, pois a equipe informada não existe.' })
      }

      const result = await user.removeTeam(team)

      if (result)
        return res.status(201).json({ message: `'${user.name}' saiu da equipe '${team.name}'` })
      else
        return res.status(400).json({ message: `Não foi possível sair da equipe, pois '${user.name}' não é jogador to time '${team.name}'` })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao remover jogador da equipe,, tente novamente mais tarde.', err })
    }
  }

  async getChampionshipByTeamId(req, res) {
    try {
      const { id } = req.params

      const result = await Team.findByPk(id, {
        include: Championship
      })

      return res.status(200).json({ result })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar torneios, tente novamente mais tarde.', err })
    }
  }

  async getMatchesByTeamId(req, res) {
    try {
      const { id } = req.params

      const team = await Team.findByPk(id)

      if (!team) {
        return res.status(400).json({ message: 'Erro ao buscar partidas, pois o time informado não existe.' })
      }

      const matches = await Match.findAll({
        where: {
          [Op.or]: [
            { team1Id: id },
            { team2Id: id },
          ]
        }
      })

      if (matches.length < 1) {
        return res.status(200).json({ message: 'Não há partidas para a equipe informada, entre em um torneio para poder ter partidas.' })
      }

      return res.status(200).json({ matches })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar partidas, tente novamente mais tarde.' })
    }
  }

}
module.exports = new TeamController