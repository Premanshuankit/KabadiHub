const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const {identifier, pwd} = req.body

    if (!identifier || !pwd) {
        return res.status(400).send('identifier and pwd are required')
    }

    // Search by username OR email OR mobile
        const foundUser = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { mobile: identifier }
            ]
        }).exec()

    if (!foundUser) {
        return res.status(401).send('identifier does not exist') // unauthorised
    }

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)

    if ( match ) {
        // const roles = Object.values(foundUser.roles)
        const roles = [...foundUser.roles.values()]

        // create JWTs
        // const accessToken = jwt.sign(
        //     { "UserInfo": 
        //         {
                    
        //             "username": foundUser.username,
        //             "roles": roles
        //         }
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '300s'}
        // )

        // Create Access Token (Store id + role)
        // const accessToken = jwt.sign(
        //     { "UserInfo": 
        //         {
        //             "id": foundUser._id,
        //             "roles": roles
        //         }
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '15m' }
        // )

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    id: foundUser._id,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        )


        // const refreshToken = jwt.sign(
        //     { "username": foundUser.username },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1d'}
        // )

         //  Create Refresh Token
        const refreshToken = jwt.sign(
            { "id": foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        // saving refresh token with current user
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
        // res.send('successfully logged in')
        res.json({ accessToken })
    } else {
        res.status(401).send('please enter correct password')
    }
}

module.exports = { handleLogin }