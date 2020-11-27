require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');
//need to ensure the order of functions

app.use(express.static(path.join(__dirname, 'public')));

//log thong tin
console.log(`---[evn PORT] : ${process.env.PORT}`);
console.log(`---[dirname]: ${__dirname}`);

//morgan log request
const morgan = require('morgan');
//app.use(morgan('combined'));

app.use(
  morgan('combined', {
    stream: {
      write: (message) => {
        console.log(message);
      },
    },
  }),
);

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

//connect database
const db = require('./config/db');
db.connect();

//api - swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0.0',
      title: 'Customer API',
      description: 'Customer API Information',
      contact: {
        name: 'Amazing Developer',
      },
      servers: ['http://localhost:3000'],
    },
  },
  // ['.routes/*.js']
  apis: ['src/index.js', 'src/routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//get method
app.get('/', (req, res) => {
  return res.render('home');
});

//parse cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//
const camelCaseReq = require('./middlewares/camelCaseReq');
const snakeCaseRes = require('./middlewares/snakeCaseRes');
app.use(camelCaseReq);
app.use(snakeCaseRes());

//route
const route = require('./routes');
route(app);

//handle error
const handleError = require('./errors/arror-handler');
app.use(handleError);

app.listen(PORT, () => {
  console.log(`---Server is running PORT: ${PORT}`);
});
