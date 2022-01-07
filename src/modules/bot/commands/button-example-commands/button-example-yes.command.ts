import { ButtonInteraction, CacheType } from "discord.js";
import { Bot } from "../../bot";
import { Command, CommandDescription } from "../command";

export class ButtonsYesCommand extends Command {
    description: CommandDescription = {
        name: 'yes',
        description: `Interaction with button example "yes"`
    };

    constructor(parent: Bot) {
        super(parent);
    }

    async handleButton(interaction: ButtonInteraction, commandArr: string[]) {
        if(commandArr.length) {
            interaction.reply('whoa nelly, stop!');
        } else {
            console.log('Ping Sub', interaction);
            let channel = await interaction.channel?.fetch()

            if(channel) {

                let message = channel.messages.cache.get(interaction.message.id)
                
                if(message) {
                    console.log('OLD MESSAGE', message);
                    await message.delete();

                    interaction.reply({
                        content: 'I thought you would :smile:',
                        // ephemeral: true
                    });
                } else {
                    console.log('Message not found');
                    
                }
            }
            
        }
    }
}