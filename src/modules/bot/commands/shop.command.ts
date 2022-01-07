import { APIButtonComponent, APIButtonComponentWithCustomId } from "discord-api-types";
import { MessageActionRow, MessageButton, InteractionButtonOptions, MessageSelectMenu, CommandInteraction, ButtonInteraction, MessageSelectMenuOptions } from "discord.js";
import { Bot } from "../bot";
import { Command, CommandDescription } from "./command";

export class ShopCommand extends Command {
    constructor(parent: Bot) {
        super(parent);
    }

    description: CommandDescription = {
        name: 'shop',
        description: 'Opens the inferno minigame shop',
        type: 1,
        defaultPermission: true
    };

    handleCommand(interaction: CommandInteraction) {
        console.log('shop command initiated');
        
        let row = new MessageActionRow()
            .addComponents(
                // new MessageButton({
                //     style: 1,
                //     label: 'ok',
                //     customId: 'ping/sub'
                // } as InteractionButtonOptions)
                new MessageSelectMenu({
                    options: [
                        {
                            label: 'Key',
                            value: 'key'
                        }
                    ],
                    customId: 'shop'
                } as MessageSelectMenuOptions)
            )

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
            ],
            components: [
                row
            ]
        })
    };
}