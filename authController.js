const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const User = require('./models/User')
const Role = require('./models/Role')

class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }

            const { username, password } = req.body
            const candidate = await User.findOne({ username })

            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем существует!' })
            }

            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'USER' })
            const user = new User({ username, password: hashPassword, roles: [userRole.value] })
            await user.save()
            return res.json({ message: 'Пользователь успешно зарегистрирован!' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Registration error" })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })

            if (!user) {
                return res.status(404).json({ message: `Пользователь с таким именем ${username} не найден` })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if (!validPassword) {
                return res.status(404).json({ message: 'Введён неверный пароль' })
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: "Login error" })
        }
    }

    async getUsers(req, res) {
        try {
            res.json('server works!!!')
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new AuthController()
