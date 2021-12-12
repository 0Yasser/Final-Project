const { Router } = require('express')
const friendController = require('../controllers/friendController')
const router = Router()

router.get('/api/friend',friendController.viewAllRequests)
router.post('/api/friend',friendController.sendRequest)
router.put('/api/friend',friendController.replayToRequest)
router.delete('/api/friend',friendController.removeFriend)

module.exports = router