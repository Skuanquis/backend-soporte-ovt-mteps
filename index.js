require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');  
const atencionRoutes = require('./routes/atencionRoutes');
const actividadRoutes = require('./routes/actividadesRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/api', userRoutes);
app.use('/api', atencionRoutes);
app.use('/api', actividadRoutes);

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});