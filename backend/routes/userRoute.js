const { Router } = require('express')
const userController = require('../controllers/userController')
const router = Router()

router.get('/api/users',userController.get_all_users)
router.post('/api/user',userController.create_user)
router.delete('/api/user',userController.delete_account)

module.exports = router