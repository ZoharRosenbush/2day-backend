const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, userColor: getNiceRandomColor() })
}

function getNiceRandomColor() {
    let red = "#E2445C";
    let orange = "#FDAB3D";
    let green = "#00C875";
    let blue = "#0073ea";
    let pink = "#FAA1F1";
    let darkblue = "#292f4c";

    let niceColors = [darkblue, pink, blue, green, orange, red];
    let drawnNum = _getRandomIntInclusive(0, niceColors.length - 1);
    let randColor = niceColors[drawnNum];
    return randColor;
}

module.exports = {
    signup,
    login,
}