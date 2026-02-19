const User = require('../model/User')
const bcrypt = require('bcrypt')
const ROLES_LIST = require('../config/roles_list')
const registerSchema = require('../validators/registerValidator')

const handleNewUser = async (req, res) => {
    const {user, fname, lname, email, mobile, address, pwd, roles} = req.body

    if (!user || !fname || !lname || !email  || !mobile || !address  || !pwd) {
        return res.status(400).send('username/fname/lname/email/mobile/address/pwd are required')
    }
    const { error } = registerSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    // check the duplicate user in the DB
    // const duplicate = await User.findOne({ username: user}).exec()
    // if (duplicate) {
    //     return res.status(409).send('username already exist, please try with another username')
    // }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10)

        let assignedRoles = {}

        if (roles && Array.isArray(roles)) {
            roles.forEach(role => {
                if (ROLES_LIST[role]) {
                    assignedRoles[role] = ROLES_LIST[role]
                }
            })
        }

        if (Object.keys(assignedRoles).length === 0) {
            assignedRoles = { Seller: ROLES_LIST.Seller }
        }

        // create and store the new user
        const newUser = await User.create({
            username: user,
            firstname: fname,
            lastname: lname,
            email: email,
            mobile: mobile,
            address: address,
            roles: assignedRoles,
            password: hashedPwd
        })
        console.log(newUser)
        res.status(201).send(`user with name '${user}' was created!!!`)

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Username or email or mobile already exists!!!!!!!' });
        }
        res.status(500).send(error.message)
    }
}

module.exports = { handleNewUser }