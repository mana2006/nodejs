const express = require('express');
const router = express.Router();

const { createBoard, getBoards, detailBoard, updateBoard, deleteBoard } = require('../controllers/boardController');
const middlewareController = require('../controllers/middlewareController');


router.post('/boards',middlewareController.verifyToken, createBoard);
router.get('/boards',middlewareController.verifyToken, getBoards);
router.get('/boards/:id',middlewareController.verifyToken, detailBoard);
router.put('/boards/:id',middlewareController.verifyToken, updateBoard);
router.delete('/boards/:id',middlewareController.verifyToken, deleteBoard);


module.exports = {
    routes: router
}
