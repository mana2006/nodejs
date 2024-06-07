const firebase = require('../db');
const firestore = firebase.firestore();
const Board = require('../models/boards');
const functionCommon = require('../utils/common_function');
const jwt = require('jsonwebtoken');


const createBoard = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const accessToken = token.split(" ")[1];
        const dataDecode = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        const userId = dataDecode.userInfo.id;

        const data = req.body;
        const delete_flag = false;
        const boardId = functionCommon.makeid(10, false);
        dataBoard = {
            id: boardId,
            name: data.name,
            description: data.description,
            delete_flag: delete_flag,
            board_owner_id: userId,
            createdAt: (new Date()).getTime()
        }
        await firestore.collection('boards').doc(boardId).set(dataBoard);
        const board = new Board(boardId, data.name, data.description);
        res.status(201).send(board);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getBoards = async (req, res, next) => {
    try {
        const boards = await firestore.collection('boards');
        const boardData = await boards.where('delete_flag', '==', false).get();
        if (!boardData.empty) {
            let allBoards = [];
            boardData.forEach(doc => {
                allBoards.push(new Board(doc.id, doc.data().name, doc.data().description))
            });
            return res.status(200).send(allBoards);
        }
        return res.status(200).send('Not a board!');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const detailBoard = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const boards = await firestore.collection('boards');
        const boardData = await boards.where('delete_flag', '==', false).where('id', '==', boardId).get();
        if (!boardData.empty) {
            let board;
            boardData.forEach(doc => {
                board = new Board(doc.id, doc.data().name, doc.data().description);
            });
            return res.status(200).send(board);
        } else {
            return res.status(404).send('Board do not existed!');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateBoard = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const data = req.body;
        const delete_flag = false;
        const boards = await firestore.collection('boards');
        const boardData = await boards.where('delete_flag', '==', delete_flag).where('id', '==', boardId).get();
        if (!boardData.empty) {
            const updateBoard = boards.doc(boardId);
            await updateBoard.update(data);
            return res.status(200).send(new Board(boardId, data.name, data.description));
        } else {
            return res.status(404).send('Board do not existed!');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteBoard = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const delete_flag = false;
        const boards = await firestore.collection('boards');
        const boardData = await boards.where('delete_flag', '==', delete_flag).where('id', '==', boardId).get();
        if (!boardData.empty) {
            const updateBoard = boards.doc(boardId);
            await updateBoard.update({
                delete_flag: true
            });
            return res.status(204).send("Board successfully deleted.");
        } else {
            return res.status(404).send('Board does not existed!');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    createBoard,
    getBoards,
    detailBoard,
    updateBoard,
    deleteBoard
}
