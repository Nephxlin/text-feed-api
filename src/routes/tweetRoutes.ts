import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const router = Router()
const prisma = new PrismaClient()
const JWT_SECRET =  process.env.JWT_SECRET || "NON LOCK SECRET"
// tweet CRUD

//create tweet
router.post('/', async (req, res) => { 
  const {content, image} =req.body
  //@ts-ignore
  const user = req.user
  try {
    const result = await prisma.tweet.create({
      data:{
        content,
        image,
        userId: user.id
      }
    })
    res.json(result)
  } catch (error) {
    res.status(400).json({message: "Username or Email should be unique"})
  }
})

// list tweet
router.get('/', async(req, res) => {
  const allTweets = await  prisma.tweet.findMany({
    include:{user:{
      select:{
        id:true,
        name:true,
        username:true,
        image:true
      }
    }}
    // select:{
  //   id:true,
  //   content:true,
  //   user:{
  //     select:{
  //       id:true,
  //       name:true,
  //       username:true,
  //       image:true
  //     }
  //   }
  // }
  })
  res.json(allTweets)
})

// get one tweet
router.get('/:id', (req, res) => {
  const {id} =req.params
  const tweet = prisma.tweet.findUnique({where:{id:Number(id)}, include:{user:true}})  

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