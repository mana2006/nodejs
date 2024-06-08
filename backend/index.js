const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config')
const userRoutes = require('./routes/user-routes');
const boardRoutes = require('./routes/board-routes');
const cardRoutes = require('./routes/card-routes.js');


const app = express ();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes.routes);
app.use('/api', boardRoutes.routes);
app.use('/api', cardRoutes.routes);


app.listen(config.port, () => console.log('Server has started on port:' + config.port));

// app.use(express.json());
