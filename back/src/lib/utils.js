import jwt from "jsonwebtoken"

export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{        //generated jwt token  //token has userid in it
        expiresIn:"7d"         // jwt_secret is for safe hashing 
    });

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,              //store the token in cookie
        httpOnly:true,     // for XSS attack 
        sameSite:"strict",  // for CSRF attack
    });

    return token;
}