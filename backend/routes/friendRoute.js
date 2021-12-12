const { Router } = require('express')
const friendController = require('../controllers/friendController')
const router = Router()

router.get('/backend/friend',friendController.viewAllRequests)
router.post('/backend/friend',friendController.sendRequest)
router.put('/backend/friend',friendController.replayToRequest)
router.delete('/backend/friend',friendController.removeFriend)

module.exports = router