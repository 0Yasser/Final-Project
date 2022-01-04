const { Router } = require('express')
const groupController = require('../controllers/groupController')
const router = Router()

router.get('/api/group/:id',groupController.getGroup)
router.post('/api/group/:id',groupController.createGroup)
router.put('/api/group/:id',groupController.deleteGroup)

router.get('/api/groups/all/:id',groupController.viewMyGroups)
router.put('/api/group/add/:id',groupController.addToGroup)
router.delete('/api/group/remove/:id',groupController.removeFromGroup)
router.post('/api/group/leave/:id',groupController.leaveGroup)

module.exports = router