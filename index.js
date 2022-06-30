const express = require('express');
const passport = require('passport');
const app = express();
require('dotenv').config();
const LocalStategy = require('passport-local').Strategy;
const session = require('express-session');
const { authenticate } = require('passport');

const {PORT, KEY_SESSION} = process.env;

//change body-parser
app.use(express.json());

const store = session.MemoryStore();

// express session
app.use(session({
    saveUninitialized: false,
    secret: KEY_SESSION,
    cookie: {
        maxAge: 1000 * 60 //60s
    },
    store
}))

// passport 
app.use(passport.initialize());
app.use(passport.session());


app.get('/status', (req, res) => {
        res.status(200).json({
            status: "Success",
            message: "ok"
        })
})

app.post('/login',passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}) ,(req, res) => {
    try {
        res.json({
            body: req.body
        })
    } catch (error) {
        res.json({
            error: error
        })
    }
})

app.get('/profile', (req, res) => {
    if(req.isAuthenticated()) {
       return res.status(200).json({
        status: "Success",
        data: {
            username: "kiet"
        }
    })
    }
    res.json(200).json({
        status: "Miss",
        message: "error"
    })
    
})

const user = {
    "username" : "123",
    "password" : "123"
}

passport.use(new LocalStategy( (username, password, done) => {
        console.log(`Username : ${username} | Password : ${password}`);
        if (username === user.username && password === user.password){
            return done(null, {
                username,
                password,
                active: true // nay muon tra ve gi tra
            })
        }
        done(null, false)
}))

passport.serializeUser( (user, done) => done(null, user.username))

passport.deserializeUser( (username, done) => {
    console.log(`deserializeUse : ${username}`);
    if (username === user.username){
        return done(null, {
            username, 
            active: true
        })
    }
    done(null, false)
})


app.listen(PORT, () => {
    console.log(`PORT on ${PORT}`);
})