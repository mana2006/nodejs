const express = require('express');
const router = express.Router();

const { createCard, getCards, detailBoard, updateBoard, deleteBoard, invitePeople } = require('../controllers/cardController');
const middlewareController = require('../controllers/middlewareController');


router.post('/boards/:boardId/cards',middlewareController.verifyToken, createCard);
router.get('/boards/:boardId/cards',middlewareController.verifyToken, getCards);
// router.get('/boards/:id',middlewareController.verifyToken, detailBoard);
// router.put('/boards/:id',middlewareController.verifyToken, updateBoard);
// router.delete('/boards/:id',middlewareController.verifyToken, deleteBoard);
router.post('/boards/:boardId/invite',middlewareController.verifyToken, invitePeople);



module.exports = {
    routes: router
}
