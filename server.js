const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(conn => console.log(`MongoDB connected`))
    .catch(console.log)
;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/products', require('./api/routes/products'))
app.use('/orders', require('./api/routes/orders'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))