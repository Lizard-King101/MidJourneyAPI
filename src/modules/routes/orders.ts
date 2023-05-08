import express from "express";
import crypto from "crypto";
import { parseString } from "xml2js";
import axios from "axios";
import fs from "fs-extra";
import path from "path";

import { JondoAccessToken, ShopifyOrder } from "../../types/shopify";
import createFormat from "../order_formatters/create";
import apiFormat from "../order_formatters/api";
import cancelFormat from "../order_formatters/cancel";


declare global {
    namespace NodeJS {
        interface Global {
            access_token: JondoAccessToken;
        }
    }
}

const orderRoutes = express.Router();

async function getToken(): Promise<JondoAccessToken> {
    return new Promise(async (resolve, reject) => {
        if(!global.access_token || global.access_token.expires_in < new Date()) {
            const params = new URLSearchParams();
            params.append('userId', ''+global.config.shopify.jondo_user_id);
            params.append('apiKey', global.config.shopify.jondo_api_key);
            let response = await axios.post<string>('https://jondohd.com/jondoApi/generateToken.php', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/xml'
                },
            }).catch((error) => {
                reject('Jondo Error: ' + error);
            });
            if(!response) return;
            try {
                parseString(response.data, (err, result) => {
                    let obj = result.response;
                    let token = {
                        token: obj.access_token[0],
                        expires_in: new Date(new Date().getTime() + (obj.expires_in[0] * 1000)),
                        token_type: obj.token_type[0]
                    } as JondoAccessToken;
                    global.access_token = token;
                    resolve(token);
                })
            } catch(error) {
                reject('Parse Error: ' + error);
            }
        } else {
            resolve(global.access_token);
        }
    })
}

orderRoutes.post('/order/*', async (req, res, next) => {
    console.log(req.originalUrl, req.headers);
    // await getToken();
    // let hmac = <string | undefined>req.headers['x-shopify-hmac-sha256'];
    // if(!hmac) return;
    // let hash = crypto.createHmac("sha256", global.config.shopify.shopify_webhook_token).update(JSON.stringify(req.body)).digest("base64");
    // console.log(hash, hmac);
    next();
})

orderRoutes.post<any, any, ShopifyOrder>('/order/create', async (req, res, next) => {
    let xml = createFormat(req.body);
    let token = await getToken().catch((error) => {
        res.status(500).send(error);
    });
    if(!token) return;

    let result = await axios.post('https://jondohd.com/jondoApi/create/createOrder', xml, {
        headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/xml'
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
    if(!result) return;
    console.log('JONDO RESULT:', result);
    res.status(200).send('ok');
});

orderRoutes.post<any, any, ShopifyOrder>('/order/cancel', async (req, res, next) => {
    let xml = cancelFormat(req.body);
    let token = await getToken().catch((error) => {
        res.status(500).send(error);
    });
    if(!token) return;

    let result = await axios.post('https://jondohd.com/jondoApi/cancel/cancelOrder', xml, {
        headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/xml',
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
    if(!result) return;
    console.log('JONDO RESULT:', result);
    res.status(200).send('ok');
});

orderRoutes.post('/order/status', async (req, res, next) => {
    console.log(req.body);
    res.send('ok');
})

orderRoutes.get('/order/test', async (req, res, next) => {
    res.send(await getToken());
})

export default orderRoutes;