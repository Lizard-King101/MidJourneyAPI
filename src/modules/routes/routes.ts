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
        let ppi = 72;
        let iWidth = width / ppi;
        let iHeight = height /ppi;

        let innerWidth = (iWidth - 3) * ppi;
        let innerHeight = (iHeight - 3) * ppi;

        
        const canvas = await sharp(imageFile).resize({
            width: +width,
            height: +height,
            fit: 'cover'
        });

        const image = await sharp(imageFile).resize({
            width: innerWidth,
            height: innerHeight,
            fit: 'cover'
        });

        let gutter = 1.5*ppi;

        const virTop = await image.clone().flip().extract({width: innerWidth, height: gutter, top: 0, left: 0});
        const virBot = await image.clone().flip().extract({width: innerWidth, height: gutter, top: innerHeight - gutter, left: 0});
        const horLef = await image.clone().flop().extract({height: innerHeight, width: gutter, top: 0, left: innerWidth - gutter});
        const horRig = await image.clone().flop().extract({height: innerHeight, width: gutter, top: 0, left: 0});

        const flipFlop = await image.clone().flip().flop();
        const norEas = await flipFlop.clone().extract({width: gutter, height: gutter, top: 0, left: innerWidth - gutter});
        const norWes = await flipFlop.clone().extract({width: gutter, height: gutter, top: 0, left: 0});
        const souEas = await flipFlop.clone().extract({height: gutter, width: gutter, top: innerHeight - gutter, left: innerWidth - gutter});
        const souWes = await flipFlop.clone().extract({height: gutter, width: gutter, top: innerHeight - gutter, left: 0});

        virTop.png().toBuffer().then((buffer) => console.log);
        

        canvas.composite([
            {input: await virTop.toBuffer(), gravity: sharp.gravity.south},
            {input: await norEas.toBuffer(), gravity: sharp.gravity.southwest},
            {input: await virBot.toBuffer(), gravity: sharp.gravity.north},
            {input: await norWes.toBuffer(), gravity: sharp.gravity.southeast},
            {input: await horLef.toBuffer(), gravity: sharp.gravity.west},
            {input: await souEas.toBuffer(), gravity: sharp.gravity.northwest},
            {input: await horRig.toBuffer(), gravity: sharp.gravity.east},
            {input: await souWes.toBuffer(), gravity: sharp.gravity.northeast},
            {input: await image.toBuffer()}
        ])

        canvas.png().pipe(res);
        // res.pipe();
    } catch(error) {
        console.error(error);
    }
})

Routes.use(orderRoutes);

export default Routes;