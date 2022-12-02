const userSession=(req,res,next)=>{
    if(req.session.userLoggedIn){
        next()
    }else{
        res.redirect('/user-log')
    }
}
module.exports={userSession}