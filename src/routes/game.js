const express = require('express');
const WordModel = require('../models/word');
const GameModel = require('../models/game');
const TryModel = require('../models/try');

const Router = express.Router();

const isLogged = (request, response, next) => {
    if (request.session.user) {
        next();
    } else {
        return response.status(500).json({ msg: 'Not logged in!' });
    }
};

Router.post('/', async (request, response) => {
    const word = await WordModel.aggregate([{ $sample: { size: 1 } }]);

    let game = new GameModel({
        word: word[0]._id,
        tries: [],
        user: request.session.user._id,
    });

    try {
        await game.save();

        game = await GameModel.findById(game._id)
            .populate('user')
            .populate('word');

        return response.status(200).json({
            "msg": game,
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message,
        });
    }
});

Router.get('/:id', async (request, response) => {
    const { id } = request.params;

    try {
        const game = await GameModel.findById(id);

        if (!game) {
            return response.status(404).json({
                "msg": 'Game not found',
            });
        }

        return response.status(200).json({
            msg: game,
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message,
        });
    }
});

Router.post('/verif', isLogged, async (request, response) => {
    const { word, gameId } = request.body;
    try {
        const game = await GameModel.findOne({ _id: gameId }).populate("word");
        if (!game) {
            return response.status(404).json({ msg: "Game not found" });
        }
        const search = game.word.name.toLowerCase();

        if (typeof request.body.word === 'undefined') {
            return response.status(500).json({
                "msg": "You have to send 'word' value"
            });
        }

        const lowerCaseWord = word.toLowerCase();
        let responseWord = '';
        if (search.length === lowerCaseWord.length) {
            for (let i = 0; i < search.length; i++) {
                if (lowerCaseWord[i] === search[i]) {
                    responseWord += '1';
                } else if (search.includes(lowerCaseWord[i])) {
                    responseWord += '0';
                } else {
                    responseWord += 'x';
                }
            }
        } else {
            return response.status(500).json({
                "msg": "The word length must be " + search.length.toString()
            });
        }

        const newTry = new TryModel({
            word: lowerCaseWord,
            result: responseWord
        });

        await newTry.save();

        game.tries.push(newTry._id);
        await game.save();
        const newGame = await GameModel.findOne({ _id: gameId }).populate("word").populate("tries");
        const statusCode = search === lowerCaseWord ? 200 : 500;
        return response.status(statusCode).json({
            "word": lowerCaseWord,
            "response": responseWord,
            "game": newGame
        });
    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }
})

module.exports = Router;