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
import { Sockets } from './socket';
import Routes from './routes/routes';
import bodyParser from 'body-parser';


declare global {
    namespace NodeJS {
        interface Global {
            bot: Bot;
            user: BotUser;
            socket: Sockets;
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
        this.app.use(express.raw({type: 'application/json'}))
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
        this.app.use(express.static(global.paths.root + '/public'));
        this.httpServer = http.createServer(this.app);
        
        global.bot = new Bot();
        global.user = new BotUser();
        global.socket = new Sockets(this.httpServer);

        this.app.use(Routes);

        let port = global.config.dev ? global.config.hosts.development.httpPort : global.config.hosts.production.httpPort;
        this.serverListen(port);

        // cron.schedule('*/1 * * * *', () => {
        //     console.log('Cron Ran');
        // });
    }

    async serverListen(port: number) {
        this.httpServer?.listen(port, () => {
            console.log(`HTTP listening on port: ${port}`);
        })

    }
}