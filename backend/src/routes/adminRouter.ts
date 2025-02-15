import { Router } from "express";
import { addUser, adminLogin, adminLogout, deleteUser, editUser, getUsers } from "../controllers/adminController";
import { verifyToken } from "../middleware/verifyToken";
import { verifyAdminToken } from "../middleware/verifyAdminToken";

const adminRouter = Router();


adminRouter.post('/login',adminLogin);

adminRouter.post('/get-users',verifyAdminToken, getUsers);

adminRouter.post('/logout', adminLogout);

adminRouter.post('/delete-user',deleteUser);
adminRouter.post('/edit-user',editUser);
adminRouter.post('/add-user',addUser);

export default adminRouter;