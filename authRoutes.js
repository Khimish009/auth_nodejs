const Router = require('express')
const { check } = require('express-validator')
const authController = require('./authController')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

const router = new Router()

router.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не должен быть меньше 4 и болько 10 символов').isLength({ min: 4, max: 10 })
],
    authController.registration)
router.post('/login', authController.login)
router.get('/users', roleMiddleware(['ADMIN', 'USER']), authController.getUsers)


module.exports = router