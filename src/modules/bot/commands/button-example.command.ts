import { APIButtonComponent, APIButtonComponentWithCustomId } from "discord-api-types";
import { MessageActionRow, MessageButton, InteractionButtonOptions, MessageSelectMenu, CommandInteraction, ButtonInteraction, MessageSelectMenuOptions } from "discord.js";
import { Bot } from "../bot";
import { Command, CommandDescription } from "./command";
import { ButtonsYesCommand } from "./button-example-commands/button-example-yes.command";
import { ButtonsNoCommand } from "./button-example-commands/button-example-no.command";

export class ButtonsExampleCommand extends Command {
    children: Command[];

    constructor(parent: Bot) {
        super(parent);
        this.children = [
            new ButtonsYesCommand(parent),
            new ButtonsNoCommand(parent)
        ]
    }

    description: CommandDescription = {
        name: 'buttons',
        description: 'Test buttons command',
        type: 1,
        defaultPermission: true
    };

    handleCommand(interaction: CommandInteraction) {
        console.log('ping command initiated');
        
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton({
                    style: 1,
                    label: 'Yes',
                    customId: 'buttons/yes'
                } as InteractionButtonOptions),
                new MessageButton({
                    style: 1,
                    label: 'Nah',
                    customId: 'buttons/no'
                } as InteractionButtonOptions)
            )

        interaction.reply({
            // ephemeral: true,
            content: 'Aren\'t buttons cool? :thinking:',
            components: [row]
        })
    };
}