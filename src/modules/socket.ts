import { Server } from "node:http";
import { Server as SocketServer } from "socket.io";
import bs58 from 'bs58';
import { PromptInteract, Updates } from "./user";
import { Recent } from "../types/recent";

export class Sockets {
    io: SocketServer;

    socketTokens: {[key: string]: string} = {};

    constructor(private server: Server) {
        this.io = new SocketServer(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.initListeners();
    }

    initListeners() {
        this.io.on('connect', (socket) => {
            console.log('SOCKET CONNECTED');

            socket.on('auth-token', async (token: string) => {
                console.log('TOKEN', token);
                
                this.socketTokens[socket.id] = token;

                global.bot.checkParent('1069002589968007179').catch((error) => {
                    console.error(error)
                })
            })

            socket.on('no-auth', () => {
                let token = this.newID;
                this.socketTokens[socket.id] = token;
                socket.emit('set-auth', token);
            })

            socket.on('disconnect', async (reason) => {
                let channel_id = await global.bot.getChannelID(this.socketTokens[socket.id]).catch((error) => {
                    console.error(error);
                });
                if(channel_id) {
                    global.bot.deleteChannel(channel_id);
                }
                console.log('SOCKET DISCONNECTED', reason);
            })

            socket.on('create-prompt', async (prompt: string) => {
                let channel_id = await global.bot.createRoom(this.socketTokens[socket.id]).catch((error) => {
                    socket.emit('prompt-error', error);
                });
                if(!channel_id) return;

                let timout: NodeJS.Timeout | undefined = setTimeout(() => {
                    socket.emit('prompt-error', 'ARRTIFICIAL is at capacity right now, please try again shortly.');
                }, 30000);

                console.log('PROMPT', prompt);
                let user = global.user;

                let sendPreview = (preview: Updates) => {
                    
                    if(timout) {
                        clearTimeout(timout);
                        timout = undefined;
                    }

                    if(preview.type == 'upscale') {
                        // RECENTLY CREATED
                    }
                   
                    socket.emit('prompt-preview', preview);
                }

                let promptWaiting = (channelId: string) => {
                    socket.emit('prompt-waiting', channelId);
                }

                let promptClose = () => {
                    user.off(`${channel_id}-preview`, sendPreview);
                    user.off(`${channel_id}-waiting`, promptWaiting);
                    user.off(`${channel_id}-close`, promptClose);
                }

                user.on(`${channel_id}-preview`, sendPreview);

                user.on(`${channel_id}-waiting`, promptWaiting)

                user.on(`${channel_id}-close`, promptClose)

                user.submitPrompt({
                    prompt,
                    channel: channel_id
                })
            })

            socket.on('prompt-interact', (interact: PromptInteract) => {
                let channel_id = interact.channel;
                let user = global.user;

                let sendPreview = (url: any) => {
                    socket.emit('prompt-preview', url);
                }

                let promptWaiting = () => {
                    socket.emit('prompt-waiting');
                }

                let promptClose = () => {
                    user.off(`${channel_id}-preview`, sendPreview);
                    user.off(`${channel_id}-waiting`, promptWaiting);
                    user.off(`${channel_id}-close`, promptClose);
                }

                user.on(`${channel_id}-preview`, sendPreview);

                user.on(`${channel_id}-waiting`, promptWaiting);

                user.on(`${channel_id}-close`, promptClose);

                user.submitInteract(interact)
            })

            socket.emit('get-auth')
        })

        global.user.on('recent', (recent: Recent) => {
            this.io.sockets.emit('recent', recent);
        })
    }

    get newID() {
        return bs58.encode(Buffer.from((new Date().getTime()).toString(16), 'hex')) 
    }
}

