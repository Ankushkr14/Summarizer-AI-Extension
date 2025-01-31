const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { authRouter } = require('./routes/auth');
const { textRoute } = require('./routes/summarizer');


dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/summary',textRoute);


function main() {
    const DB_URL = process.env.MONGO_URL;
    mongoose.connect(DB_URL)
        .then(() => console.log('MongoDB Connected'))
        .catch((error) => {
            console.log('MongoDB connection error:', error);
        });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server connected on port ${PORT}`);
    });
}

main();
