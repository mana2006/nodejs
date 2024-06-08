const express = require('express');
const router = express.Router();

const { createCard, getCards, deleteCard, invitePeople, inviteAccept } = require('../controllers/cardController');
const middlewareController = require('../controllers/middlewareController');


router.post('/boards/:boardId/cards', middlewareController.verifyToken, createCard);
router.get('/boards/:boardId/cards', middlewareController.verifyToken, getCards);
router.post('/boards/:boardId/invite', middlewareController.verifyToken, invitePeople);
router.post('/boards/:boardId/cards/:id/invite/accept', middlewareController.verifyToken, inviteAccept);
router.delete('/boards/:boardId/cards/:id', middlewareController.verifyToken, deleteCard);



module.exports = {
    routes: router
}
