const { async } = require('@firebase/util');
const firebase = require('../db');
const firestore = firebase.firestore();
const Card = require('../models/cards');
const functionCommon = require('../utils/common_function');


const createCard = async (req, res, next) => {
    try {
        const data = req.body;
        const boardId = req.params.boardId;
        const delete_flag = false;
        const cardId = functionCommon.makeid(10, false);
        dataCard = {
            id: cardId,
            name: data.name,
            description: data.description,
            delete_flag: delete_flag,
            createdAt: data.created_at,
            board_id: boardId
        }
        await firestore.collection('cards').doc(cardId).set(dataCard);
        const card = new Card(cardId, data.name, data.description);
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getCards = async (req, res, next) => {
    try {
        const cards = await firestore.collection('cards');
        const boardId = req.params.boardId;
        const cardData = await cards.where('delete_flag', '==', false).where('board_id', '==', boardId).get();
        if (!cardData.empty) {
            let allCards = [];
            cardData.forEach(doc => {
                allCards.push(new Card(doc.id, doc.data().name, doc.data().description))
            });
            return res.status(200).send(allCards);
        }
        return res.status(200).send('Not a card!');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// const detailBoard = async (req, res, next) => {
//     try {
//         const boardId = req.params.id;
//         const boards = await firestore.collection('boards');
//         const boardData = await boards.where('delete_flag', '==', false).where('id', '==', boardId).get();
//         if (!boardData.empty) {
//             let board;
//             boardData.forEach(doc => {
//                 board = new Board(doc.id, doc.data().name, doc.data().description);
//             });
//             return res.status(200).send(board);
//         } else {
//             return res.status(404).send('Board do not existed!');
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

// const updateBoard = async (req, res, next) => {
//     try {
//         const boardId = req.params.id;
//         const data = req.body;
//         const delete_flag = false;
//         const boards = await firestore.collection('boards');
//         const boardData = await boards.where('delete_flag', '==', delete_flag).where('id', '==', boardId).get();
//         if (!boardData.empty) {
//             const updateBoard = boards.doc(boardId);
//             await updateBoard.update(data);
//             return res.status(200).send(new Board(boardId, data.name, data.description));
//         } else {
//             return res.status(404).send('Board do not existed!');
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

// const deleteBoard = async (req, res, next) => {
//     try {
//         const boardId = req.params.id;
//         const delete_flag = false;
//         const boards = await firestore.collection('boards');
//         const boardData = await boards.where('delete_flag', '==', delete_flag).where('id', '==', boardId).get();
//         if (!boardData.empty) {
//             const updateBoard = boards.doc(boardId);
//             await updateBoard.update({
//                 delete_flag: true
//             });
//             return res.status(204).send("Board successfully deleted.");
//         } else {
//             return res.status(404).send('Board does not existed!');
//         }
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

const invitePeople = async (req, res, next) => {
    try {
        const data = req.body;
        const boardId = req.params.boardId;
        const delete_flag = false;
        const inviteId = data.invite_id ?? functionCommon.makeid(10, false);
        if( data.board_owner_id) {
            const board = await firestore.collection('boards').doc();
            const boardData = board.where('board_owner_id', '==', data.board_owner_id).get();
            if (boardData.empty) {
                return res.status(404).send('Board owner invalid!');
            }
        }
        const user = await firestore.collection('users').doc();
        let userData;
        if(data.member_id) {
            userData = user.where('id', '==', data.member_id);
        }
        if (data.email_member) {
            userData = user.where('email', '==', data.email_member);
        }

        if (userData.empty) {
            return res.status(404).send('MemberId invalid!');
        }
        dataCard = {
            id: cardId,
            name: data.name,
            description: data.description,
            delete_flag: delete_flag,
            createdAt: data.created_at,
            board_id: boardId
        }
        await firestore.collection('cards').doc(cardId).set(dataCard);
        const card = new Card(cardId, data.name, data.description);
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    createCard,
    getCards,
    // detailBoard,
    // updateBoard,
    // deleteBoard,
    invitePeople
}
