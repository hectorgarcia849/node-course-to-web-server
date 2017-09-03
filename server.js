const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000; //stores all environment variables as key value pairs, if one can't be found we set to 3000.

var app = express();

//configure express
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//app use is to create middleware, they get called in the order they are put in obv.

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log("Unable to append to server.log");
        }
    });
    next();
});

// app.use((req,res,next) => {
//     res.render('maintenance.hbs');//if don't call next, the handlers app.get will not get executed below
// });

app.use(express.static(__dirname + '/public'));


//helpers to load methods into templates
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) =>{
    return text.toUpperCase();
});

app.get('/', (req, res) => { //pass in url, function to run: request and response
    //res.send('<h1>Hello Express</h1>'); //response to the http request
    res.render('home.hbs', {
        pageTitle: 'Hector',
        welcomeMessage: "Welcome!"
    });
});

app.get('/about', (req, res)=>{
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
   res.send({
       errorMessage: 'Bad request!'
   })
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page'
    });
});

//set up to deploy to heroku
app.listen(port, ()=>{console.log(`Server is up on port ${port}`)}); //port listening on 3000, listens until told to stop