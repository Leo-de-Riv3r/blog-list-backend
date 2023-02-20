const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  const body = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  if (body.username && body.password && body.password.length > 2){
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  res.json(savedUser)
} else {
  response.status(400).json({"error": "Content missing"}).end()
}
})

usersRouter.get("/", async(req,res,next) => {
  const users = await User.find({}).populate('blogs', {url:1, title:1, author:1, id: 1})
  res.json(users)
})
module.exports = usersRouter