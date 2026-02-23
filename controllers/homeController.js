
const handleHome = (req, res) => {
    console.log('home triggered')
    res.json({ message: "Backend working" })
}

module.exports = { handleHome }