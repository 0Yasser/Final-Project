const { Router } = require('express')
const userController = require('../controllers/userController')
const router = Router()

router.get('/api/users',userController.get_all_users)

router.get('/api/user/:id',userController.get_user_from_token)
router.get('/api/user/search/:id',userController.get_username)
router.delete('/api/user',userController.delete_account)

router.post('/auth/signup',userController.create_user)
router.post('/auth/login',userController.log_user)



module.exports = router