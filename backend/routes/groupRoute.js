const { Router } = require('express')
const groupController = require('../controllers/groupController')
const router = Router()

router.get('/api/group/:id',groupController.viewAllGroups)
router.post('/api/group/:id',groupController.createGroup)
router.delete('/api/group/:id',groupController.deleteGroup)
router.post('/api/group/add/:id',groupController.addToGroup)
router.post('/api/group/remove/:id',groupController.removeFromGroup)
router.post('/api/group/leave/:id',groupController.leaveGroup)

module.exports = router