require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const apiRouter = require('./api');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ message: 'PharmaExpress API работает 💊' }));
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[Server] PharmaExpress API запущен на порту ${PORT}`));
});
