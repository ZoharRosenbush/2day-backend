const boardService = require('./board.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getBoards(req, res) {
  try {
    // let { filterBy } = req.query;
    // console.log('the filter by parse', filterBy)
    // filterBy = JSON.parse(filterBy);

    // TO DO: ADD FOLTER BY TO THE QUERY IN ROW 12
    const boards = await boardService.query()
    // console.log('the boares in controller',boards)
    res.json(boards);
  } catch (err) {
    console.log(err)
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

// GET BY ID 
async function getBoardById(req, res) {
  try {
    const boardId = req.params.id;
    console.log('board id in controller', boardId);
    const board = await boardService.getById(boardId)
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

// POST (add board)
async function addBoard(req, res) {
  try {
    const board = req.body;
    const addedBoard = await boardService.add(board)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

// PUT (Update board)
async function updateBoard(req, res) {
  try {
    const board = req.body;
    console.log('req body', board)
    await boardService.update(board)
    console.log('Updated board succesfuly');
    res.json(board)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })

  }
}

// DELETE (Remove board)
async function removeBoard(req, res) {
  try {
    const boardId = req.params.id;
    const removedId = await boardService.remove(boardId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}

async function updateBoardGroup(req, res) {
  console.log(req.params.id);
  // const boardId = req.params.id;
  // console.log('the board id in server add',boardId)
  // const board = await boardService.getById(boardId)
  const groupToSave = req.body;

  const groupIdx = board.groups.findIndex(
    (group) => groupToSave.id === group.id
  );
  console.log('the groupIdx', groupIdx);

  if (groupIdx === -1) {
    board.groups.unshift(newGroup);
  } else {
    board.groups[groupIdx] = groupToSave;
  }
  console.log('the board to save in server', board)
  await boardService.update(board)
  return groupToSave
}

async function removeBoardGroup(req, res) {
  const boardId = req.params.id;
  const groupId = req.params.groupId
  const board = await boardService.getById(boardId)

  const filteredGroups = board.groups.filter((group) => {
    return group.id !== groupId;
  });
  board.groups = filteredGroups

  await boardService.update(board)
  return groupId
}


module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  updateBoardGroup,
  removeBoardGroup
}
