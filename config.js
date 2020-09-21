require('dotenv').config();

module.exports = {
    authJwtSecret: process.env.AUTH_JWT_SECRET,
    database: {
        mongodb: {
            url: 'mongodb://localhost:27017',
            dbStaticData: 'FCA',
            dbSchool: 'school',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        }
    },
    urlencoded: {
        extended: false
    }
}