const jwt = require('jsonwebtoken')

const verifyJwt = ( req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401).send('unauthorised access!!')
    }
    console.log(authHeader, ' authHeader')
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ 'message' : 'invalid token'})
                // return res.status(403).send('invalid token')
            }
            // req.user = decoded.UserInfo.username
            req.userId = decoded.UserInfo.id
            req.roles = decoded.UserInfo.roles 

            console.log(decoded, 'decoded')
            next()
        }
    )
}

module.exports = verifyJwt