import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { commands } from './commands/commands';
import { Command } from './commands/command';
import { CategoryChannel, Client, Intents, MessageReaction, User }  from 'discord.js';
import { WebHooks } from './webhooks';

export class Bot {
    // events
    rest?: REST;
    client?: Client;
    commands: Command[];
    hooks: WebHooks;
    

    constructor() {
        this.commands = commands.map(c => new c(this));
        this.hooks = new WebHooks();
        
        if(global.config.bot_config) {
            let { application_id, bot_token } = global.config.bot_config
            this.rest = new REST({ version: '9' }).setToken(bot_token)

            this.register(application_id).then(()=> {
                console.log('new client');
                
                this.client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS ] });
    
                this.client.on('ready', () => {
                    console.log('Bot ready');
                })
    
                // this.client.on('interactionCreate', (interaction) => {
                //     // console.log('Message', interaction);
                //     // if(interaction)
                //     if(interaction.isCommand()) {
                //         let command = this.commands.filter(c => c.description?.name == interaction.commandName).pop();
                //         if(command && command.handleCommand) {
                //             command.handleCommand(interaction);
                //         } else {
                //             interaction.reply('Error processing comand');
                //         }
                //     }
    
                //     if(interaction.isButton()) {
                //         console.log('Button');
                        
                //         let commandArr = interaction.customId.split('/');
                //         console.log('command array', commandArr);
                        
                //         let command = this.commands.filter(c => c.description?.name == commandArr[0])[0];
                //         if(command) {
                //             command.handleButton(interaction, commandArr.slice(1, commandArr.length))
                //         } else {
    
                //         }
                //     }
                // })
    
                // this.client.on('messageReactionAdd', async (reaction, user) => {
                //     console.log('REACTION START');
                    
                //     const handleReaction = (reaction: MessageReaction, user: User) => {
                //         console.log(reaction);
                //         if(reaction.message.webhookId) {
                //             this.hooks.emit(reaction.message.webhookId, { reaction, user });
                //         }
                //     }
    
                //     let fetchedReaction: MessageReaction | undefined;
                //     let fetchedUser: User | undefined;
    
                //     if(reaction.partial) {
                //         try {
                //             fetchedReaction = await reaction.fetch();
                //         } catch(err) {
                //             console.log('Error fetching reaction');
                //         }
                //     } else {
                //         fetchedReaction = reaction;
                //     }
    
                //     if(user.partial) {
                //         try {
                //             fetchedUser = await user.fetch();
                //         } catch(err) {
                //             console.log('Error fetching user');
                //         }
                //     } else {
                //         fetchedUser = user;
                //     }
    
                //     if(fetchedReaction && fetchedUser) handleReaction(fetchedReaction, fetchedUser);
                // })
    
                this.client.login(bot_token)
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    register(application_id: string) {
        return new Promise((resolve, reject) => {
            this.rest?.put(
                Routes.applicationCommands(application_id),
                { body: this.commands.filter(c => c.register == true).map(c => c.description) }
            ).then((data) => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            })
        })
        
    }

    createRoom(token: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let guild = this.client?.guilds.cache.get(global.config.guild_id);
            if(!guild) {
                reject('error fetching guild');
                return;
            }
            let channelName = `int-${token}`.toLocaleLowerCase();
            console.log('CHANNEL NAME', channelName);
            
            let foundChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() == channelName);
            
            if(foundChannel) {
                // let result = foundChannel.delete('recreate');
                // console.log('DELETING OLD CHANNEL', result);
                console.log('FOUND OLD CHANNEL', foundChannel);
                resolve(foundChannel.id);
                return;
            }

            let channel = await guild.channels.create(channelName, {
                parent: '1069002589968007179',
                type: 0
            }).catch((error) => {
                reject(error);
            })
            if(!channel) return;
            console.log('NEW CHANNEL', channel);
            resolve(channel.id);
        })

    }

    getChannelID(token: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let guild = this.client?.guilds.cache.get(global.config.guild_id);
            if(!guild) {
                reject('error fetching guild');
                return;
            }
            let channelName = `int-${token}`.toLocaleLowerCase();
            
            let foundChannel = guild.channels.cache.find((channel) => channel.name.toLowerCase() == channelName);
            
            if(!foundChannel) {
                reject('Channel not found');
                return;
            }
            resolve(foundChannel.id);
            return;
        });
    }

    deleteChannel(id: string) {
        return new Promise(async (resolve, reject) => {
            let guild = this.client?.guilds.cache.get(global.config.guild_id);
            if(!guild) {
                reject('error fetching guild');
                return;
            }

            let foundChannel = await guild.channels.cache.get(id)
            let deleteResult = await foundChannel?.delete();
            resolve(true);
        })
    }

    checkParent(id: string) {
        return new Promise((resolve, reject) => {
            let guild = this.client?.guilds.cache.get(global.config.guild_id);
            if(!guild) {
                reject('error fetching guild');
                return;
            }
            let foundChannel = <CategoryChannel | undefined>guild.channels.cache.find((channel) => channel.type == 'GUILD_CATEGORY' && channel.id == id);
            if(!foundChannel) {
                reject('category not found');
                return;
            }

            console.log('CATEGORY CHILDREN', foundChannel.children.size);
        })
    }
}

