import { Express } from 'express';
import express from 'express';
import session from 'express-session';
import Cors from 'cors';
import framegaurd from 'frameguard';

import http from 'http';
/*
    Type Definitions
*/
import { Server } from 'node:http';
import { Bot } from './bot/bot';
import { BotUser } from './user';

var cron = require('node-cron');

declare global {
    namespace NodeJS {
        interface Global {
            bot: Bot;
            user: BotUser;
        }
    }
}

export class Main {
    httpServer: Server | null = null;


    constructor(
        private app: Express
    ) {
        
        this.app.set('trust proxy', 1);
        this.app.use(framegaurd());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(express.json());
        this.app.use(Cors());
        this.app.use(session({
            secret: 'some secret change later',
            resave: true,
            saveUninitialized: true,
            cookie: { 
                expires: new Date(new Date().getTime() + 300000),
                secure: false,
                sameSite: true
            }
        }));
        
        this.httpServer = http.createServer(this.app);
        
        global.bot = new Bot();
        global.user = new BotUser();
        
        this.serverListen();

        // cron.schedule('*/1 * * * *', () => {
        //     console.log('Cron Ran');
        // });
    }

    async serverListen() {
        this.httpServer?.listen(3000, () => {
            console.log('HTTP listening on port: '+3000);
        })

    }
}