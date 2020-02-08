// Displays a leaderboard for the current guild
// Please make sure you've installed these packages
// npm install quick.db | discord.js | loadash.sortby
// Created 8/2/2020

const Discord = require('discord.js');
const db = require('quick.db');
var sortBy = require('lodash.sortby');

// Since the updated quick.db version "7.0.0-b22" no longer supports startsWith
// Create custom function

function startsWith(db, str, options = { sort: undefined }) {
    var arr = [];
    for (const el of db.fetchAll()) {
        if (el.ID === null || !el.ID.startsWith(str)) continue;
        const { ID, data } = el;
        arr.push({
            ID: el.ID,
            data: el.data
        });
    }
    if (typeof options.sort === 'string') {
        if (options.sort.startsWith('.')) options.sort = options.sort.slice(1);
        options.sort = options.sort.split('.');
        arr = sortBy(arr, options.sort);
        arr = arr.reverse();
    }
    return arr;
}

exports.run = async (client, message, args, tools) => {
    
    //First, want to fetch every entry where the ID starts with a certain string
    let arrayContent = startsWith(db, `${message.guild.id}`, {sort: '.data'});
   
    // This essentially creates the body of the messages
    let content = 'Leaderboard: \n\n';
    
    //Loop through the array specific for the guild
    for (let i = 0; i < arrayContent.length; i++) {
        // Add onto the content string
        content += `${client.users.get(arrayContent[i].ID.split('_')[1]).tag} -- $${arrayContent[i].data} donations \n`;
    }

    const embed = new Discord.RichEmbed()
    .setAuthor(`${message.guild.name} - Leaderboard!`, message.guild.iconURL)
    .setDescription(content)
    .setColor("#fa9600")

    //Finally, send the message
    message.channel.send(embed);

}
