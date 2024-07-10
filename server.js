const bodyParser = require('body-parser')
const express = require('express')

const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const connectWithRetry = require('./db')
const userController = require('./routes/api/userController')

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // replace with your application's URL
  credentials: true,  // IMPORTANT: enable credentials. This is needed for cookies to work
}));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"))
app.use(helmet())
connectWithRetry();

app.use("/api/v1/speech/ai/user", userController);
app.listen(PORT, console.log(`API is listening on port ${PORT}`));