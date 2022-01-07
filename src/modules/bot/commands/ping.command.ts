import { CommandInteraction } from "discord.js";
import { Bot } from "../bot";
import { Command, CommandDescription } from "./command";

export class PingCommand extends Command {
    constructor(parent: Bot) {
        super(parent);
    }

    description: CommandDescription = {
        name: 'ping',
        description: 'Test ping command',
        type: 1,
        defaultPermission: true
    };

    handleCommand(interaction: CommandInteraction) {
        console.log('ping command initiated');
        
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: 'Pong',
                    description: 'This is a pong to your ping :wink:',
                    author: {
                        name: 'Me'
                    }
                }
            ]
        })
    };
}