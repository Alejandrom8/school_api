module.exports = {
    database: {
        mongodb: {
            url: 'mongodb://localhost:27017',
            db: 'pruebas',
            user_collection: 'user',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        }
    },
    session: {
        secret: 'tv mariposa',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    },
    cookie:{
        secret: "tv mariposa"
    },
    urlencoded: {
        extended: false
    }
}