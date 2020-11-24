const express = require('express');
const app = express();
const port = 3001;
const path = require('path');

//
app.use(express.static(path.join(__dirname, 'public')));

//log thong tin
console.log(`---[evn port] : ${process.env.port}`);
console.log(`---[dirname]: ${__dirname}`);

//morgan log request
const morgan = require('morgan');
app.use(morgan('combined'));

//middleware parse formdata ra object json, giống sử dụng body-parser,
app.use(
  express.urlencoded({
    extended: true,
  }),
);

//middleware parse data from XMLHttpRequest, fetch, axios,
app.use(express.json());

//template engine
const hbs = require('express-handlebars');
app.engine(
  'hbs',
  hbs({
    extname: '.hbs',
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//route
const route = require('./routes');
route(app);

//connect database
const db = require('./config/db');
db.connect();

//get method
app.get('/', (req, res) => {
  return res.render('home');
});

app.listen(port, () => {
  console.log(`---Server is running port: ${port}`);
});
