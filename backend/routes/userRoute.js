const { Router } = require('express')
const userController = require('../controllers/userController')
const router = Router()

router.get('/backend/users',userController.get_all_users)
router.post('/backend/user',userController.create_user)
router.delete('/backend/user',userController.delete_account)

module.exports = router