const { Router } = require('express')
const friendController = require('../controllers/friendController')
const router = Router()

router.get('/api/friends/all/:id',friendController.getMyFriends)
router.get('/api/friends/pending/:id',friendController.getRecievedFriendRequests)
router.get('/api/friend/request/:usernames',friendController.getRequestID)
router.post('/api/friend',friendController.sendRequest)
router.put('/api/friend',friendController.replayToRequest)
router.delete('/api/friend/:id',friendController.removeFriend)

module.exports = router