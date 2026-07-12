import { Router } from "express";
import { uploadImage } from "../controllers/upload.controller";
import { upload } from "../middlewares/upload";


const router = Router();


/*
 POST
 /upload/image
*/

router.post(
  "/image",
  upload.single("image"),
  uploadImage
);


export default router;
