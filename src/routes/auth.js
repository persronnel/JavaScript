const express = require('express');
const bcrypt = require('bcrypt');

const Router = express.Router();
const saltRounds = 10;

const UserModel = require('../models/user');

Router.post('/register', async (request, response) => {
    const {email, email_cfg, password, password_cfg, username, active} = request.body;

    const hash = await bcrypt.hash(password, saltRounds);

    const user = new UserModel({
        email,
        password: hash,
        username,
        active
    });

    try {
        
        await user.save();

        return response.status(200).json({
            "user": user
        });

    } catch (error) {
        return response.status(500).json({
            "error": error.message
        });
    }

});

module.exports = Router;