const User = require('../model/User')

const handleLogout =  async (req, res) => {
    // on client , also delete the accesstoken
    const cookies = req.cookies
    console.log('cookies : ', cookies)

    const refreshToken = cookies.jwt

    // is refresh token in the db?
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        return res.sendStatus(403)
    }

    // delete refresh token in the db
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log('logout success : ', result)
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true}) // secure: true  -- only serves on https
    res.status(200).json({ message: "Logout successful" });
}

module.exports = { handleLogout }