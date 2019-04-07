var expressSession = require("express-session");
var mongoStore = require("connect-mongodb-session")(expressSession);

var store = new mongoStore({
    uri: "mongodb://",
    collection: "Sessions"
});

store.on("error", function (err) {
    console.log("[SESSION ERROR]", err);
});

// @ts-ignore
var session = expressSession({
    secret: "s3cr3t th1ng we n33d",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 52 * 2,
    },
    store,
    resave: true,
    saveUninitialized: true
});

module.exports = session;