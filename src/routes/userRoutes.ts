import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient()

// USER CRUD

//create user
router.post('/', async (req, res) => { 
  const {email,name,username} =req.body

  try {
    const result = await prisma.user.create({
      data:{
        email,
        name,
        username,
        bio: 'hello, its my new account'
      }
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({message: "Username or Email should be unique"})
  }
})

// list users
router.get('/', async (req, res) => {
  const allUser = await prisma.user.findMany()

  res.json(allUser)

})

// get one user
router.get('/:id', async (req, res) => {
  const {id} =req.params
  const user = await prisma.user.findUnique({ where: { id: Number(id) } })

  res.json(user)
})

//update user
router.put('/:id', async (req, res) => {
  const {id} =req.params
  const {bio,name,username,email, image} =req.body
  try {
    const result = await prisma.user.update({
      where: {id: Number(id)},
      data:{
        email,
        name,
        username,
        bio
      }
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({message: "Failed to update user"})
  }
})

//delete user
router.delete('/:id', async (req, res) => {
  const {id} =req.params
  await prisma.user.delete({ where: { id: Number(id) } })
  res.sendStatus(204)
})


export default router