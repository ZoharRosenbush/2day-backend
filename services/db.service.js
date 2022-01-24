const MongoClient = require('mongodb').MongoClient

const config = require('../config')

module.exports = {
    getCollection
}

// Database Name
const dbName = 'boardDB'

var dbConn = null

async function getCollection(collectionName) {
    // console.log('get collection activated')
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        // console.log('the collection in db ',collection)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    // console.log('connect activated')
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}




