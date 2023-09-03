import { Router } from "express";

const router = Router()

// tweet CRUD

//create tweet
router.post('/', (req, res) => { 
  res.send(501).json({ message: 'Not implemented' })
})

// list tweet
router.get('/', (req, res) => {
  res.send(501).json({ message: 'Not implemented' })
})

// get one tweet
router.get('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})

//update tweet
router.put('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})

//delete tweet
router.delete('/:id', (req, res) => {
  const {id} =req.params
  res.send(501).json({ message: `Not implemented ${id}` })
})


export default router