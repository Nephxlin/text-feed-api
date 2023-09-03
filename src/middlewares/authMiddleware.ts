import { Request,Response,NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken"

const JWT_SECRET =  process.env.JWT_SECRET || "NON LOCK SECRET"

const prisma = new PrismaClient()

type AuthRequest = Request & { user?:User }

export async function authenticateToken(req:AuthRequest,res:Response,next:NextFunction){
  const authHeader = req.headers['authorization']
  const jwtToken = authHeader?.split(' ')[1]
  if(!jwtToken) return res.status(401).json({message: "Not authorized token"})

  //decode jwt
  try{
    const payload = (await jwt.verify(jwtToken, JWT_SECRET)) as {tokenId:number}
    const dbToken = await prisma.token.findUnique({
      where:{id:payload.tokenId},
      include:{user:true}
    })
   
    if(!dbToken?.valid || dbToken.expiration < new Date()) return res.status(401).json({message: "API TOKEN NOT VALID!"})

    req.user = dbToken.user
  }catch(error){
    res.sendStatus(401)
  }

  next()
}