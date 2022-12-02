const express=require('express')
const router=express.Router()
const error=require('../controller/error')

router.use(error.err)

module.exports=router;