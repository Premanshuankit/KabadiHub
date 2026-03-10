const User = require('../model/User')

const handleLogout =  async (req, res) => {
    // on client , also delete the accesstoken
    const cookies = req.cookies
    console.log('cookies : ', cookies)

    if (!cookies?.jwt) {
        return res.status(204).json({ message: "No refresh token cookie" });
    }

    const refreshToken = cookies.jwt;
    // is refresh token in the db?
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.status(403).json({ message: "User not found" });
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    console.log("logout success");

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})

    return res.status(200).json({ message: "Logout successful" });
};

module.exports = { handleLogout }