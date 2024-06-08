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
        const boardId = req.params.boardId;
        const cards = await firestore.collection('cards');
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

const deleteCard = async (req, res, next) => {
    try {
        const boardId = req.params.boardId;
        const cardId = req.params.id;
        const delete_flag = false;
        const boards = await firestore.collection('boards');
        const boardData = await boards.where('delete_flag', '==', delete_flag).where('id', '==', boardId).get();
        const cards = await firestore.collection('cards');
        const cardData = await cards.where('delete_flag', '==', delete_flag).where('id', '==', cardId).where('board_id', '==', boardId).get();
        if (boardData.empty) {
            return res.status(404).send("Board not found!");
        }
        if (!cardData.empty) {
            const updateCard = cards.doc(cardId);
            await updateCard.update({
                delete_flag: true
            });
            return res.status(204).send("Card successfully deleted.");
        } else {
            return res.status(404).send('Card does not existed!');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const invitePeople = async (req, res, next) => {
    try {
        const data = req.body;
        const boardId = req.params.boardId;
        const delete_flag = false;
        const inviteId = data.invite_id ?? functionCommon.makeid(10, false);

        if (data.board_owner_id) {
            const board = await firestore.collection('boards');
            const boardData = await board.where('board_owner_id', '==', data.board_owner_id).where('delete_flag', '==', delete_flag).get();
            if (boardData.empty) {
                return res.status(404).send('Board owner invalid!');
            }
        }

        const user = await firestore.collection('users');
        let userData;
        if (data.member_id) {
            userData = user.where('id', '==', data.member_id);
        }
        if (data.email_member) {
            userData.where('email', '==', data.email_member);
        }
        
        if (userData.empty) {
            return res.status(404).send('MemberId invalid!');
        }

        let email = [];
        userData.forEach(doc => {
            email.push(doc.data().email)
        });
        let email_member = data.email_member ? data.email_member : email[0];
        await functionCommon.sendAuth(email_member, 'Invite member', 'Send email member');
        dataBoardInvite = {
            invite_id: inviteId,
            board_onwer_id: data.board_owner_id,
            member_id: data.member_id,
            delete_flag: delete_flag,
            email_member: email_member,
            status: 'pending',
            board_id: boardId
        }
        await firestore.collection('board_invite').doc(inviteId).set(dataBoardInvite);
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const inviteAccept = async (req, res, next) => {
    try {
        const boardId = req.params.boardId;
        const cardId = req.params.id;
        const data = req.body;
        const inviteId = data.invite_id ? data.invite_id : functionCommon.makeid(10, false);
        const delete_flag = false;

        if (boardId) {
            const board = await firestore.collection('boards');
            const boardData = await board.where('id', '==', boardId).where('delete_flag', '==', delete_flag).get();
            if (boardData.empty) {
                return res.status(404).send('Board not found!');
            }
        }

        if (cardId) {
            const card = await firestore.collection('cards');
            const cardData = await card.where('id', '==', cardId).where('delete_flag', '==', delete_flag).get();
            if (cardData.empty) {
                return res.status(404).send('Board not found!');
            }
        }

        if (data.member_id) {
            const user = await firestore.collection('users');
            const userData = user.where('id', '==', data.member_id).get();
            if (userData.empty) {
                return res.status(404).send('MemberId invalid!');
            }
        }
        const dataBoardAccept = {
            invite_id: inviteId,
            card_id: cardId,
            memeber_id: data.member_id,
            status: data.status
        }

        await firestore.collection('board_invite').doc(inviteId).set(dataBoardAccept);
        res.status(200).send();

    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    createCard,
    getCards,
    deleteCard,
    invitePeople,
    inviteAccept,
}
