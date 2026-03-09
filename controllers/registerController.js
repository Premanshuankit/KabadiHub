const User = require('../model/User')
const bcrypt = require('bcrypt')
const ROLES_LIST = require('../config/roles_list')
const registerSchema = require('../validators/registerValidator')
const logger = require('../utils/logger')


const handleNewUser = async (req, res) => {
    try {

        // Parse address BEFORE validation
        if (req.body.address && typeof req.body.address === "string") {
            try {
                req.body.address = JSON.parse(req.body.address);
            } catch {
                return res.status(400).json({ message: "Invalid address format" });
            }
        }

        // Parse roles BEFORE validation
        if (req.body.roles && typeof req.body.roles === "string") {
            try {
                req.body.roles = JSON.parse(req.body.roles);
            } catch {
                return res.status(400).json({ message: "Invalid roles format" });
            }
        }

        const { user, fname, lname, email, mobile, address, pwd, roles, shopname} = req.body;

        if (!user || !fname || !lname || !email || !mobile || !address || !pwd) {
            return res.status(400).send(
                "username/fname/lname/email/mobile/address/pwd are required"
            );
        }

        // Joi validation AFTER parsing
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const hashedPwd = await bcrypt.hash(pwd, 10);

        let assignedRoles = {};

        if (roles && Array.isArray(roles)) {
            roles.forEach(role => {
                if (ROLES_LIST[role]) {
                    assignedRoles[role] = ROLES_LIST[role];
                }
            });
        }

        if (Object.keys(assignedRoles).length === 0) {
            assignedRoles = { Seller: ROLES_LIST.Seller };
        }

        console.log("assignedRoles:", assignedRoles);
        console.log("req.file:", req.file);

        const newUser = await User.create({
            username: user,
            firstname: fname,
            lastname: lname,
            email,
            mobile,
            address,
            roles: assignedRoles,
            password: hashedPwd,
            shopname: shopname || null,
            shopImage: req.file ? req.file.path : null
        });

        console.log("newUser:", newUser);
        logger.info(`newUser ${newUser}`);

        res.status(201).json({
            message: `user with name '${user}' was created!!!`
        });

    } catch (error) {

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                field,
                message: `${field} already exists`
            });
        }

        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// const handleNewUser = async (req, res) => {
//     const {user, fname, lname, email, mobile, address, pwd, roles, shopname} = req.body

//     if (!user || !fname || !lname || !email  || !mobile || !address  || !pwd) {
//         return res.status(400).send('username/fname/lname/email/mobile/address/pwd are required')
//     }

//     // Parse address string to object
//     // let parsedAddress;
//     // try {
//     //     parsedAddress = JSON.parse(req.body.address);
//     // } catch (err) {
//     //     return res.status(400).json({ message: "Invalid address format" });
//     // }

//     // // Replace string with object
//     // req.body.address = parsedAddress;

//     let parsedAddress = req.body.address;

//     if (typeof parsedAddress === "string") {
//         parsedAddress = JSON.parse(parsedAddress);
//     }


//     const { error } = registerSchema.validate(req.body)
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message })
//     }
//     // check the duplicate user in the DB
//     // const duplicate = await User.findOne({ username: user}).exec()
//     // if (duplicate) {
//     //     return res.status(409).send('username already exist, please try with another username')
//     // }

//     try {
//         const hashedPwd = await bcrypt.hash(pwd, 10)

//         let roles = req.body.roles;

//         if (typeof roles === "string") {
//             roles = JSON.parse(roles);
//         }

//         let assignedRoles = {}

//         if (roles && Array.isArray(roles)) {
//             roles.forEach(role => {
//                 if (ROLES_LIST[role]) {
//                     assignedRoles[role] = ROLES_LIST[role]
//                 }
//             })
//         }
//         console.log('assignedRoles', assignedRoles)
//         if (Object.keys(assignedRoles).length === 0) {
//             assignedRoles = { Seller: ROLES_LIST.Seller }
//         }

//         console.log("roles raw:", req.body.roles);
//         console.log("roles type:", typeof req.body.roles);

//         // create and store the new user
//         const newUser = await User.create({
//             username: user,
//             firstname: fname,
//             lastname: lname,
//             email: email,
//             mobile: mobile,
//             address: parsedAddress,
//             roles: assignedRoles,
//             password: hashedPwd,
//             shopname: shopname,
//             shopImage: req.file ? req.file.path : null
//         })
//         console.log("req.file:", req.file);
//         console.log(newUser)
//         logger.info(`newUser, ${newUser}`)
//         res.status(201).json({ message: `user with name '${user}' was created!!!`})

//     } catch (error) {
//         // if (error.code === 11000) {
//         //     return res.status(409).json({ message: 'Username or email or mobile already exists!!!!!!!' });
//         // }
//         // res.status(500).send(error.message)

//         if (error.code === 11000) {
//             const field = Object.keys(error.keyValue)[0];
//             return res.status(409).json({ field: field, message: `${field} already exists` });
//         }
//         res.status(500).json({ message: "Server error" });
//     }
// }

module.exports = { handleNewUser }