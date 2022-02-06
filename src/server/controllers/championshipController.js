const { Op } = require("sequelize");
const { findByPk } = require('../models/championshipModel')
const Championship = require('../models/championshipModel')
const Match = require('../models/matchModel')


class ChampionshipController {

  async createChampionship(req, res) {
    const { body } = req

    const status = 'Created'
    const {
      name,
      description,
      numberTeams,
      award,
      creatorUserId
    } = body

    const exists = await Championship.findAll({ where: { name } })

    if (exists) {
      for (var championshipObj in exists) {
        if (championshipObj.status != 'Concluded')
          return res.status(400).json({ message: 'Já existe um torneio ativo com esse nome' })
      }
    }

    const createdUser = await Championship.create({
      name,
      description,
      numberTeams,
      award,
      status,
      creatorUserId
    })

    return res.status(201).json({ message: 'Torneio criado com sucesso', createdUser })
  }

  async getInfosChampionshipById(req, res) {

    const { id } = req.params

    const championship = await Championship.findByPk(id)

    if (!championship) {
      return res.status(400).json({ message: 'Não existe um torneio correspondente ao Id informado' })
    }

    return res.status(200).json({ championship })

  }

  async getInfosAllChampionship(req, res) {

    try {

      const championship = await Championship.findAll()

      if (!championship) {
        return res.status(400).json({ message: 'Não há torneios cadastrados.' })
      }

      return res.status(200).json({ championship })

    } catch (err) {
      return res.status(500).json({ Message: 'Não foi possível buscar os torneios, tente novamente mais tarde' })
    }
  }

  async deleteChampionshipById(req, res) {

    const { id } = req.params

    try {
      const championship = await Championship.findByPk(id)
      if (championship.status == 'OpenSubscriptions' || championship.status == 'started') {
        return res.status(400).json({ message: 'Não é permitido remover um torneio que está com Inscrições abertas ou em Andamento.' })
      }

      const championshipDeletionStatus = await Championship.destroy({ where: { championshipId: id } })

      if (championshipDeletionStatus)
        return res.status(200).json({ message: 'Torneio removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar torneio.' })
    }
  }

  async getMatchesByChaphioshipId(req, res) {

    const { id } = req.params

    try {
      const championship = await Championship.findByPk(id)

      if (!championship) {
        return res.status(400).json({ message: 'Erro ao buscar partidas, pois o torneio informado não existe.' })
      }

      const matches = await Match.findAll({ where: { championshipId: id } })

      if (matches.length < 1) {
        return res.status(200).json({ message: 'As partidas referente a esse torneio ainda não foram geradas.' })
      }

      return res.status(200).json({ matches })

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao buscar partidas, tente novamente mais tarde.' })
    }
  }

  async updateMatchByAdminChampionship(req, res) {
    try {
      const { body } = req

      const { idchampionship, idmatch } = req.params

      const {
        UserId,
        status,
        goals1,
        goals2,
        offSide1,
        offSide2,
        fouls1,
        fouls2,
        ballPossession1,
        ballPossession2,
      } = body

      const IsAdmin = await Championship.findOne({ where: { championshipId: idchampionship, creatorUserId: UserId } })

      if (!IsAdmin) {
        return res.status(400).json({
          message: 'Erro ao editar partida, pois o torneio informado não existe ou o usuário não é administrador do torneio.'
        })
      }

      const existsMatch = await Match.findByPk(idmatch)

      if (!existsMatch) {
        return res.status(400).json({
          message: 'Id da partida inválido.'
        })
      }

      if (existsMatch.status == 'Concluded') {
        return res.status(400).json({
          message: 'Impossível editar informações de uma partida que já foi concluída.'
        })
      }

      if (ballPossession1 + ballPossession2 != 100) {
        return res.status(400).json({
          message: 'Erro: a soma das posses de bola deve ser igual a 100.'
        })
      }

      if (existsMatch.status == 'Started' && status == 'Created') {
        return res.status(400).json({
          message: 'Erro: não é permitido reverter o status de uma partida que já foi iniciada para Criada.'
        })
      }

      var winner
      if (parseInt(goals1) > parseInt(goals2)) {
        winner = existsMatch.team1Id
      }
      if (parseInt(goals2) > parseInt(goals1)) {
        winner = existsMatch.team2Id
      }

      const updatedMatch = await Match.update({
        status,
        goals1,
        goals2,
        offSide1,
        offSide2,
        fouls1,
        fouls2,
        ballPossession1,
        ballPossession2,
        winner
      }, { where: { matchId: idmatch } })

      if (updatedMatch) {
        return res.status(200).json({ message: 'Partida atualizada com sucesso' })
      }
      else {
        return res.status(400).json({ message: 'Impossível atualizar partida com as informações fornecidas' })
      }

    } catch (err) {
      return res.status(500).json({ message: 'Erro ao atualizar partida, tente novamente mais tarde.' })
    }
  }

}
module.exports = new ChampionshipController