import express from "express";
import orderRoutes from "./orders";

import path from "path";
import sharp from "sharp";
import fs from "fs-extra";

const Routes = express.Router();

Routes.use('*', (req, res, next) => {
    // console.log(req.headers);
    next();
});

Routes.get('/', (req, res, next) => {
    res.status(200).send('Hello')
});

Routes.get<any, {width: string, height: string, image: string}>('/image/:width/:height/:image', async (req, res, next) => {
    let recentPath = path.join(global.paths.root, 'public', 'recent');
    let { width, height, image } = req.params;
    let imagePath = path.join(recentPath, req.params.image);
    let test = "187f8482c17.135.png";
    let imageFile = await fs.readFile(imagePath);
    console.log(imagePath, imageFile);
    
    try {
        const imagePipe = await sharp(imageFile)
            .resize({
                width: +width,
                height: +height,
                fit: 'cover'
            })
            
            .png();

        imagePipe.pipe(res);
        // res.pipe();
    } catch(error) {
        console.error(error);
    }
})

Routes.use(orderRoutes);

export default Routes;