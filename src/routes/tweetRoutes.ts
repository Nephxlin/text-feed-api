import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router()
const prisma = new PrismaClient()

// tweet CRUD

//create tweet
router.post('/', async (req, res) => { 
  const {content, image,userId} =req.body

  try {
    const result = await prisma.tweet.create({
      data:{
        content,
        userId,
        image
      }
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({message: "Username or Email should be unique"})
  }
})

// list tweet
router.get('/', (req, res) => {
  const allTweets = prisma.tweet.findMany()
  res.json(allTweets)
})

// get one tweet
router.get('/:id', (req, res) => {
  const {id} =req.params
  const tweet = prisma.tweet.findUnique({where:{id:Number(id)}})  

  if(!tweet) return res.status(404).json({message: "Tweet not found"}) 
  res.json(tweet)
})

//update tweet
router.put('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})

//delete tweet
router.delete('/:id', async (req, res) => {
  const {id} =req.params
  await prisma.user.delete({ where: { id: Number(id) } })
  res.sendStatus(204)
})


export default router