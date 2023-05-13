const Router = require('express')
const typeController = require('../controllers/typeController')
const checkRole = require('../middlewares/checkRoleMiddleware')

const router = new Router()

router.post('/', typeController.create)
router.get('/', typeController.getAll)


module.exports = router