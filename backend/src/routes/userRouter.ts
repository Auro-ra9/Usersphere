import { Router } from 'express';
import { getProfile, uploadImage, userLogin, userLogout, userSignup } from '../controllers/userController';
import { verifyToken } from '../middleware/verifyToken';

const userRouter= Router();

//here everything comes with a prefix of api/ from the client (here index.ts) 
userRouter.post('/signup',userSignup);
userRouter.post('/login',userLogin);
userRouter.post('/get-profile', verifyToken, getProfile);
userRouter.post('/logout', userLogout);
userRouter.post('/upload-image',verifyToken,uploadImage)

export default userRouter