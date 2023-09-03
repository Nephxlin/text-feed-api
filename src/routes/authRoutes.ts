import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10
const AUTHENTICATION_EXPIRATION_HOURS = 12  // 12 hours
const JWT_SECRET =  "SECRET"

const router = Router()
const prisma = new PrismaClient()

function generateEmailToken() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function generateAuthToken(tokenId:number):string{
  const jwtPayload = {tokenId}

  return jwt.sign(jwtPayload, JWT_SECRET,{
    algorithm: "HS256",
    noTimestamp: true
  })
}

// Create user, if doens't exist
// generate the emailToken and send it to their email
router.post('/login', async (req, res) => {
  const {email} = req.body

  const emailToken = generateEmailToken()
  const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 *1000)

  try{
    const createdToken = await prisma.token.create({
      data:{
        type: "EMAIL",
        emailToken,
        expiration,
        user:{
          connectOrCreate:{
            where: { email },
            create: { email}
          },
        }
      }
    })
    console.log(createdToken)
    res.sendStatus(201)
  } catch(error){
    res.sendStatus(400).json({message: "Could't start authentication process"})
  }
})

//Validate the emailToken
//Generate a long-lived JWT TOKEN
router.post("/authenticate", async (req, res) => { 
  const {email,emailToken} = req.body
  console.log(email,emailToken)
  const dbEmailToken = await prisma.token.findUnique({
    where: {emailToken},
    include: {user: true}
  })

  console.log(dbEmailToken)
  if(!dbEmailToken || !dbEmailToken.valid) return res.sendStatus(401)

  if(dbEmailToken.expiration < new Date()) return res.sendStatus(401).json({message: "Token expired"})

  if(dbEmailToken?.user?.email !== email) return res.sendStatus(401)

  // Here we validate that tge user is the owner of the email

  // Generate an API token
  const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000)

  const apitoken = await prisma.token.create({ 
    data:{
      type: "API",
      expiration,
      user:{
        connect:{
          email
        }
      }
    }
  })

  await prisma.token.update({
    where: {id: dbEmailToken.id},
    data:{
      valid: false
    }
  })

  //generate JWT token
  const authToken = generateAuthToken(apitoken.id)

  res.json({authToken})
})

export default router