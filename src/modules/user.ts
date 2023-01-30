import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { MessageActionRow, MessageActionRowComponent } from 'discord.js';
import { Client, Intents, MessageButton }  from 'discord.js-selfbot-v13'; 
export class BotUser {
    rest: REST;
    client: Client;

    constructor() {
        let user_token = global.config.user_token;
        this.rest = new REST({ version: '9' }).setToken(user_token);
        this.client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS], checkUpdate: false});

        this.client.on('messageCreate', (message) => {
            console.log('Interaction', message.content);
            if(message.content.includes('(fast)') && message.components.length == 2 && message.components[0].components.length == 5) {
                // first render
                console.log('FIRST / VARIATIONS');
                
                let attachment = message.attachments.first();
                if(attachment) console.log('Preview', attachment.url);

                let row_1 = <Array<MessageButton>>message.components[0].components;
                // let row_2 = <Array<MessageButton>>message.components[1].components;
                let [u1, u2, u3, u4, rerun] = row_1;

                setTimeout(() => {
                    u2.click(message);
                }, 500)
                // let [v1, v2, v3, v4] = row_2;
                // console.log('Row 1:', row_1);
                // console.log('Row 2:', row_2);
            } else if(message.content.includes('Upscaled') && message.components.length == 2 && message.components[0].components.length == 4) {
                // upscaled
                console.log('UPSCALE');

                let attachment = message.attachments.first();
                if(attachment) console.log('Preview', attachment.url);
                // console.log('Row 1:', row_1);
                // console.log('Row 2:', row_2);
            }

            // if(!message.components) return;
            // let row = message.components[0];
            // if(!row) return;
            // let button = <MessageButton>row.components[0];
            // setTimeout(() => {
            //     button.click(message);
            // }, 500)
            // let body = {
            //     application_id: message.applicationId,
            //     channel_id: message.channelId,
            //     data: {
            //         componnet_type: MessageComponentTypes.BUTTON,
            //         custom_id: row.components[0].customId
            //     },
            //     guild_id: message.guildId,
            //     message_id: message.id,
            //     message_flags: 0,
            //     nonce: message.nonce,
            //     session_id: (<any>this.client.ws.shards.first()).sessionId,
            //     type: 3
            // }
            // console.log('INTERACTION RESPONSE', body);
            
        });

        this.client.on('messageUpdate', (message) => {
            console.log('Updated', message.content);
            let attachment = message.attachments.first();
            if(attachment) console.log('Preview', attachment.url);
        })

        this.client.on('ready', (client) => {
            (<any>client.channels.cache.get('1069657256993493093'))!.sendSlash('936929561302675456', 'imagine', 'cute borzoi dog running in snow');
        })

        

        

        this.client.on('messageUpdate', (message) => {

        })

        this.client.login(user_token);
        console.log('Sending Interaction');
        
    }
}