const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); 
const router = require('./router');
const csrf = require("csurf");
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001;
const IMAGES_DIR = path.join(__dirname, 'images');

const csrfProtection = csrf({
    cookie: true,
  });



app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(cookieParser());
app.use(session({
    secret: 'my_secret', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));
app.use(csrfProtection);
app.use(function (req, res, next) {
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals._csrf = token;
    next();
  });
app.use("/add-product", (req, res, next) => {
    
    let mycsrf = req.csrfToken();
   console.log(mycsrf,'1st');
    res.send(
      '<form action="/add-product/1" method="POST"><input type="hidden" name="_csrf" value=' +
        mycsrf +
        '><input type="text" name="title"><button type="submit">Add Product</button></form>'
    );
  });
  app.use("/add-product/:itemId", (req, res, next) => {
    console.log(req.csrfToken(),'2nd');
    res.setHeader("Set-Cookie", "loggedIn=true");
    res.send("<h1>Success</h1>");
  });

if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR);
}

app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(IMAGES_DIR));


app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


