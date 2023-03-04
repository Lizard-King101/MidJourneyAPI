import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Message, MessageActionRow, MessageActionRowComponent, MessageAttachment, PartialMessage } from 'discord.js';
import { Client, Intents, MessageButton }  from 'discord.js-selfbot-v13'; 
import { EventEmitter } from 'node:stream';

const percent = /\({1}([0-9]+)\%{1}\){1}/gm;

export class BotUser extends EventEmitter {
    rest: REST;
    client: Client;

    constructor() {
        super();
        let user_token = global.config.user_token;
        this.rest = new REST({ version: '9' }).setToken(user_token);
        this.client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_WEBHOOKS], checkUpdate: false});

        this.client.on('messageCreate', (message) => {
            // console.log('Interaction', message);
            if(message.content.includes('(fast)') && message.components.length == 2 && message.components[0].components.length == 5) {
                // first render
                // console.log('FIRST / VARIATIONS', message);
                
                let attachment = message.attachments.first();
                if(attachment) {
                    this.emitUpdate(message.channelId, {
                        type: 'quad',
                        url: attachment.url,
                        message: message.id,
                        channel: message.channelId
                    });
                }

                let row_1 = <Array<MessageButton>>message.components[0].components;
                // let row_2 = <Array<MessageButton>>message.components[1].components;
                // let [u1, u2, u3, u4, rerun] = row_1;

                // setTimeout(() => {
                //     u2.click(message);
                // }, 500)
                // let [v1, v2, v3, v4] = row_2;
                // console.log('Row 1:', row_1);
                // console.log('Row 2:', row_2);
            } else if(message.content.includes('Upscaled') && message.components.length == 2 && message.components[0].components.length == 4) {
                // upscaled
                // console.log('UPSCALE');

                let attachment = message.attachments.first();
                if(attachment) {
                    this.emitUpdate(message.channelId, {
                        type: 'upscale',
                        url: attachment.url,
                        message: message.id,
                        channel: message.channelId
                    });
                }
                // console.log('Row 1:', row_1);
                // console.log('Row 2:', row_2);
                
            } else {
                this.emitWaiting(message.channelId);
            }

            
            // setTimeout(async () => {
            //     // let check = await message.fetch();
            //     // console.log('WAIT FOR MESSAGE VALID', check);
            //     let getMessage = async (guildId?: string | null, channelId?: string, messageId?: string) => {
            //         if(!guildId || !channelId || !messageId) return undefined;
            //         let guild = this.client.guilds.cache.get(guildId);
            //         console.log('guild', guild);
                    
            //         if(!guild) return undefined;
            //         let channel = await guild.channels.cache.get(channelId)?.fetch();
            //         console.log('channel', channel);
                    
            //         if(!channel) return undefined;
            //         if(channel.type != 'GUILD_TEXT') return undefined;
            //         let message = channel.messages.cache.get(messageId);
            //         if(message) return message;
            //     }
            //     let { guildId, channelId, id } = message;

            //     let foundMessage = await getMessage(guildId, channelId, id);
            //     console.log('FOUND MESSAGE', foundMessage);
                
            // }, 1000)
        });

        this.client.on('messageUpdate', (message) => {
            if(message.content) {
                let exec = new RegExp(percent).exec(message.content);
                let [,perc] = exec ? exec : [undefined, undefined];                
                // console.log('Updated', message.content);
                let attachment = message.attachments.first();
                if(attachment) this.emitUpdate(message.channelId, {
                    type: 'preview',
                    url: attachment.url,
                    percentage: perc,
                    message: message.id,
                    channel: message.channelId
                });
            }
        })

        this.client.on('ready', (client) => {
            console.log('User Ready');
            
            // (<any>client.channels.cache.get('1069657256993493093'))!.sendSlash('936929561302675456', 'imagine', 'cute borzoi dog running in snow, snow fall');
        })

        this.client.login(user_token);
    }

    private emitWaiting(channel: string) {
        this.emit(`${channel}-waiting`);
    }

    private emitUpdate(channel: string, update: Updates) {
        this.emit(`${channel}-preview`, update);
    }

    private emitClose(channel: string) {
        this.emit(`${channel}-done`);
    }

    async submitPrompt(config: PromptConfig) {
        let result = await (<any>this.client.channels.cache.get(config.channel))!.sendSlash('936929561302675456', 'imagine', config.prompt);
        console.log('SUBMIT RESULT', result);
    }

    async submitInteract(interact: PromptInteract) {
        let channel = this.client.guilds.cache.get('1068979613239357501')?.channels.cache.get(interact.channel);
        if(!channel || channel?.type != 'GUILD_TEXT') {
            return false;
        }
        console.log('Channel', channel);
        
        let message = (await channel.messages.fetch()).get(interact.message);
        
        console.log('Message',interact.message, message);
        
        if(!message) {
            return false;
        }

        if(message.content.includes('(fast)') && message.components.length == 2 && message.components[0].components.length == 5) {
            // first render
            console.log('FIRST / VARIATIONS', message);
            let row_1 = <Array<MessageButton>>message.components[0].components;
            let row_2 = <Array<MessageButton>>message.components[1].components;
            let [u1, u2, u3, u4, rerun] = row_1;
            let [v1, v2, v3, v4] = row_2;
            switch(interact.interaction) {
                case 'variants-1':
                    v1.click(message);
                    break;
                case 'variants-2':
                    v2.click(message);
                    break;
                case 'variants-3':
                    v3.click(message);
                    break;
                case 'variants-4':
                    v4.click(message);
                    break;
                case 'upscale-1':
                    u1.click(message);
                    break;
                case 'upscale-2':
                    u2.click(message);
                    break;
                case 'upscale-3':
                    u3.click(message);
                    break;
                case 'upscale-4':
                    u4.click(message);
                    break;
            }
            
        }

        
    }
}

export type Updates = ResultUpdate | PreviewUpdate;

interface Update {
    type: string;
    message: string;
    channel: string;
}

interface ResultUpdate extends Update {
    type: 'quad' | 'upscale';
    url: string;
}

interface PreviewUpdate extends Update{
    type: 'preview';
    url: string;
    percentage?: string;
}

interface PromptConfig {
    prompt: string;
    channel: string;
}

export interface PromptInteract {
    message: string,
    channel: string,
    interaction: InteractionsType
}

type InteractionType = 'variants' | 'upscale';
type InteractionQuad = '1' | '2' | '3' | '4';
type InteractionsType = `${InteractionType}-${InteractionQuad}`;