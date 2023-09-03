import { Router } from "express";

const router = Router()

// USER CRUD

//create user
router.post('/', (req, res) => { 
  res.send(501).json({ message: 'Not implemented' })
})

// list users
router.get('/', (req, res) => {
  res.send(501).json({ message: 'Not implemented' })
})

// get one user
router.get('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})

//update user
router.put('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})

//delete user
router.delete('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})


export default router