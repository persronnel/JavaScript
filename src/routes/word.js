const express = require('express');
const Router = express.Router();

const WordModel = require('../models/word');

Router.post('/', async (request, response) => {
    const { word } = request.body;

    const wordModel = new WordModel({ 
        name: word
    });
    await wordModel.save();

    return response.status(200).json({
        "msg": word
    })
});

module.exports = Router;