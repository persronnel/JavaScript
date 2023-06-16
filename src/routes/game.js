const express = require('express');
const WordModel = require('../models/word');
const GameModel = require("../models/game");

const Router = express.Router();

Router.post('/', async (request, response) => {
    const word = await WordModel.aggregate([{
        $sample: {size: 1}
    }]);

    const game = new GameModel({
        word: word[0]._id,
        tries: []
    });

    try {
        await game.save();

        return response.status(200).json({
            "msg": game
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
});

Router.get('/:id', async (request, response) => {
    const {id} = request.params;

    try {
        const game = await GameModel.findOne({_id: id});

        return response.status(200).json({
            "msg": game
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
})

Router.post('/verif', (request, response) => {
    if (typeof request.body.word === 'undefined') {
        return response.status(500).json({
            "msg": "You have to send 'word' value"
        });
    }

    if (request.body.word === search) {
        return response.status(200).json({
            "result": "You find the word !"
        });
    }

    return response.status(500).json({
        "result": "You don't find the word !"
    });
})

module.exports = Router;