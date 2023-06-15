const express = require('express');

const Router = express.Router();

const words = ['moto', 'lion', 'pen'];

let search = null;

Router.post('/create', (request, response) => {
    search = words[1];
    
    return response.status(200).json({
        "msg": 'New word is set : ' + search
    })
});

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