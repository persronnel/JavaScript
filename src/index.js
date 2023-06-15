console.log('Hello Wolrd !');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const App = express();
App.use(helmet());
App.use(morgan('common'));

App.get('/', (request, response) => {
    return response.status(200).send('<h1>It works From GET !</h1>');
});

App.post('/', (request, response) => {
    return response.status(200).send('<h1>It works from POST !</h1>');
})

App.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});