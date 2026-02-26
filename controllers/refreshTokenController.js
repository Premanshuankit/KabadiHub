const User = require('../model/User')

const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

const handleRefreshToken =  async (req, res) => {
    const cookies = req.cookies

  if (!cookies?.jwt) {
    return res.sendStatus(401)
  }
    console.log(cookies.jwt)
    logger.info(`cookie.jwt,,, ${cookies.jwt}`)
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        return res.status(403).json({ message: 'unauthorised access' }) // forbidden
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
        if (err || decoded.id !== foundUser._id.toString()) {
            return res.sendStatus(403)
        }

        const roles = [...foundUser.roles.values()]

        const accessToken = jwt.sign(
            { UserInfo: {
                    id: foundUser._id,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : '1d'}
        )
        logger.info('access token issued again', accessToken)
        res.json({ accessToken })
        }
    )
}

module.exports = { handleRefreshToken }