import { Express, Request, Response } from 'express';
import { DataBase } from './database';

import fs from 'fs';

export class GET {
    db: DataBase;
    constructor(private app: Express) {
        this.db = new DataBase();
        this.app.get("*", (req, res) => {
            this.proccess(req, res);
        })
    }

    async proccess(req: Request, res: Response) {
        // split the request domain
        if(req && res) {
            // var domain = req.get('host').split(':')[0];
    
            // split url into array eg: domain.com/account/settings -> ["account", "settings"] 
            var urlArr = req.originalUrl.split('?')[0].replace(/^\/+|\/+$/g, '').split('/');
            // parse get peramiters
            var GET: any = req.query;
    
            // http or https
            var protocol = req.protocol;
            // load clinet details
    
            // res.send('ok');

            console.log({
                urlArr,
                GET,
                protocol
            })

            

        }
    }
}