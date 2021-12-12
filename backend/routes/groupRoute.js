const { Router } = require('express')
const groupController = require('../controllers/groupController')
const router = Router()

router.get('/backend/group/:id',groupController.viewAllGroups)
router.post('/backend/group/:id',groupController.createGroup)
router.delete('/backend/group/:id',groupController.deleteGroup)
router.post('/backend/group/add/:id',groupController.addToGroup)
router.post('/backend/group/remove/:id',groupController.removeFromGroup)
router.post('/backend/group/leave/:id',groupController.leaveGroup)

module.exports = router