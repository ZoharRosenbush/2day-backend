const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId



async function query(filterBy = null) {
    console.log('the filter in service', filterBy)
    try {
        // const criteria = _buildCriteria(filterBy)
        const criteria = {}
        // if (filterBy.name) {
        //     const regex = new RegExp(filterBy.name, 'i')
        //     criteria.name = { $regex: regex }
        // }
        // if (filterBy.labels.length) {
        //     criteria.labels = { $in: filterBy.labels }
        // }
        // if (filterBy.isInStock !== 'ALL') {
        //     criteria.isInStock = filterBy.isInStock
        // }
        // console.log('the cretirea',criteria)

        const collection = await dbService.getCollection('board')
        // console.log('the collection ',collection)
        const boards = await collection.find(criteria).toArray()
        return boards
    }
    catch (err) {
        console.log('the err', err)
        logger.error('cannot find boards', err)
        throw err
    }

}


async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ '_id': ObjectId(boardId) })
        // board.reviews = await reviewService.query({ boardId })
        // console.log('the board in service', board)
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ '_id': ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {

        const collection = await dbService.getCollection('board')
        await collection.insertOne(board)
        console.log('added boards in server', board);
        return board
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}
async function update(board) {
    try {
        let id = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ "_id": id }, { $set: { ...board } })
    } catch (err) {
        console.log('the err in update', err)
        logger.error(`cannot update board ${board._Id}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}



// const criteria = {_id:${boardId}}
//         const board = collection.aggregate([
//             {
//                 $match: criteria
//             },
//             {
//                 $lookup:
//                 {
//                     localField: '_id',
//                     from: 'user',
//                     foreignField: '_id',
//                     as: 'byUser'
//                 }
//             },
//             {
//                 $unwind: '$byUser'
//             },
//             {
//                 $lookup:
//                 {
//                     localField: '_id',
//                     from: 'review',
//                     foreignField: 'boardId',
//                     as: 'boardReviews'
//                 }
//             },

//         ]).toArray()