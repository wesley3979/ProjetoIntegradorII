const { findByPk } = require('../models/userModel')
const user = require('../models/userModel')

class UserController {
  async createUser(req, res) {
    const { body } = req

    const {
      name,
      email,
      password,
      image
    } = body
    const exists = await user.findOne({ where: { name } })

    if (exists) {
      return res.status(400).json({ message: 'usuário já cadastrado' })
    }

    const createdUser = await user.create({
      name,
      email,
      password,
      image
    })

    return res.status(201).json({ createdUser })
  }

  async updateUser(req, res) {
    const { body } = req
    const { id } = req.params

    const {
      name,
      email,
      password,
      image
    } = body

    try {
      await user.update({
        name,
        email,
        password,
        image,
      }, {
        where: { userId: id }
      })

      return res.status(200).json({ message: 'Atualizado com sucesso' })
    } catch (err) {
      return res.status(500).json({ err })
    }
  }

  async getUserById(req, res) {
    const { id } = req.params

    const findUser = await user.findByPk(id)

    if (findUser) {
      return res.status(200).json({ findUser })
    } else {
      return res.status(404).json({ message: 'usuário não encontrado' })
    }
  }

  async getAllUsers(req, res) {
    const allUsers = await user.findAll()

    return res.status(200).json({ allUsers })
  }

  async deleteUser(req, res) {
    const { id } = req.params

    try {
      const userDeletionStatus = await user.destroy({ where: { userId: id } })

      if (userDeletionStatus)
        res.status(200).json({ message: 'Usuário removido com sucesso.' })
      else
        throw err
    } catch (err) {
      return res.status(500).json({ message: 'Erro ao deletar usuário.' })
    }
  }

}
module.exports = new UserController