
// const { Client, Events, GatewayIntentBits } = require('discord.js');
// const Canvas = require('canvas');
// require('dotenv').config();
// const fetch = require('node-fetch');
// const FormData = require('form-data');
// const token = process.env.DISCORD_TOKEN;
// const path = require('path');
// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ],
// });

// Canvas.registerFont(path.join(__dirname, 'fonts', 'decalotype.bold.ttf'), { family: 'Decalo', weight: 'bold' });
// Canvas.registerFont(path.join(__dirname, 'fonts', 'decalotype.semibold.ttf'), { family: 'Decalo', weight: '600' });

// client.once(Events.ClientReady, (readyClient) => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

// client.on('messageCreate', async (message) => {
//   if (message.content === '!removebg') {
//     const attachment = message.attachments.first();
    
//     if (!attachment || !attachment.contentType.startsWith('image/')) {
//       return message.reply('Please upload an image with the command.');
//     }

//     try {
//       const formData = new FormData();
//       formData.append('image_url', attachment.url);
//       formData.append('size', 'auto');

//       const response = await fetch('https://api.remove.bg/v1.0/removebg', {
//         method: 'POST',
//         headers: {
//           ...formData.getHeaders(),
//           'X-Api-Key': process.env.REMOVE_BG_KEY,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`API Error: ${errorText}`);
//       }

//       const buffer = await response.buffer();
//       message.channel.send({
//         files: [{
//           attachment: buffer,
//           name: 'no-background.png'
//         }]
//       });
//     } catch (error) {
//       console.error('Background removal error:', error);
//       message.reply('Failed to remove background. Please try again.');
//     }
//   }

//   if (message.content.startsWith('!thumbnail')) {
//     // Extract title and subtitle from the command
//     const args = message.content.split('"').filter((arg) => arg.trim() !== '');
//     const title = args[1] || 'Your default title';
//     const subtitle = args[2] || '';

//     // Check if an image is attached
//     const attachment = message.attachments.first();
//     if (!attachment || !attachment.contentType.startsWith('image/')) {
//       return message.reply('Please upload an image along with your command.');
//     }

//     try {
//       const canvasWidth = 1280;
//       const canvasHeight = 720;
//       const canvasCenterX = canvasWidth / 2;
//       const canvasCenterY = canvasHeight / 2;

//       // Load the template image
//       const templatePath = path.join(__dirname, 'template.png');
//       const template = await Canvas.loadImage(templatePath);

//       const uploadedImage = await Canvas.loadImage(attachment.url);

//       const originalWidth = uploadedImage.width;
//       const originalHeight = uploadedImage.height;

//       // Maintain aspect ratio
//       const maxImageWidth = 1169;
//       const maxImageHeight = 583;
//       const scaleFactor = Math.min(maxImageWidth / originalWidth, maxImageHeight / originalHeight);
//       const imgWidth = originalWidth * scaleFactor;
//       const imgHeight = originalHeight * scaleFactor;

//       const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
//       const ctx = canvas.getContext('2d');
//       ctx.textAlign = 'left'; // Align text to the left for subtitle
//       ctx.textBaseline = 'middle';

//       ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

//       // Draw the uploaded image
//       const imgX = (canvasWidth - imgWidth) / 2;
//       const imgY = (canvasHeight - imgHeight) / 2 - 140; // Adjust Y position as needed
//       ctx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);

//       // Title (Bold)
//       ctx.font = 'bold 140px Decalo';
//       ctx.fillStyle = '#ffffff';
//       const titleWidth = ctx.measureText(title).width; 
//       const titleX = canvasCenterX - (titleWidth / 2); // Center title horizontally
//       const titleY = canvasCenterY + 150; // Adjust Y position as needed
//       ctx.fillText(title, titleX, titleY);

//       // Subtitle (SemiBold)
//       ctx.font = '600 25px Decalo';
//       ctx.fillStyle = '#dddddd';
//       const subtitleX = titleX; // Start subtitle from the left side of the title
//       const subtitleY = titleY + 100; // Position subtitle below the title
//       ctx.fillText(subtitle, subtitleX, subtitleY);

//       const attachmentBuffer = canvas.toBuffer();
//       message.channel.send({ files: [{ attachment: attachmentBuffer, name: 'thumbnail.png' }] });
//     } catch (error) {
//       console.error('Error generating thumbnail:', error);
//       message.reply('There was an error generating your thumbnail. Please try again.');
//     }
//   }
// });

// client.login(token);
const { Client, Events, GatewayIntentBits } = require('discord.js');
const Canvas = require('canvas');
require('dotenv').config();
const fetch = require('node-fetch');
const FormData = require('form-data');
const token = process.env.DISCORD_TOKEN;
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

Canvas.registerFont(path.join(__dirname, 'fonts', 'decalotype.bold.ttf'), { family: 'Decalo', weight: 'bold' });
Canvas.registerFont(path.join(__dirname, 'fonts', 'decalotype.semibold.ttf'), { family: 'Decalo', weight: '600' });

// Command Handler
const commands = {
  help: {
    description: 'Displays a list of available commands.',
    execute: (message) => {
      const commandList = Object.keys(commands)
        .map((cmd) => `**!${cmd}**: ${commands[cmd].description}`)
        .join('\n');
      message.reply(`Here are the available commands:\n${commandList}`);
    },
  },
  removebg: {
    description: 'Removes the background from an uploaded image.',
    execute: async (message) => {
      const attachment = message.attachments.first();
      if (!attachment || !attachment.contentType.startsWith('image/')) {
        return message.reply('Please upload an image with the command.');
      }

      try {
        const formData = new FormData();
        formData.append('image_url', attachment.url);
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            ...formData.getHeaders(),
            'X-Api-Key': process.env.REMOVE_BG_KEY,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${errorText}`);
        }

        const buffer = await response.buffer();
        message.channel.send({
          files: [{ attachment: buffer, name: 'no-background.png' }],
        });
      } catch (error) {
        console.error('Background removal error:', error);
        message.reply('Failed to remove background. Please try again.');
      }
    },
  },
  thumbnail: {
    description: 'Generates a thumbnail with a title and subtitle. Usage: `!thumbnail "Title" "Subtitle" and add a image`',
    execute: async (message) => {
      const args = message.content.split('"').filter((arg) => arg.trim() !== '');
      const title = args[1] || 'Your default title';
      const subtitle = args[2] || '';

      const attachment = message.attachments.first();
      if (!attachment || !attachment.contentType.startsWith('image/')) {
        return message.reply('Please upload an image along with your command.');
      }
      try {
              const canvasWidth = 1280;
              const canvasHeight = 720;
              const canvasCenterX = canvasWidth / 2;
              const canvasCenterY = canvasHeight / 2;
        
              // Load the template image
              const templatePath = path.join(__dirname, 'template.png');
              const template = await Canvas.loadImage(templatePath);
        
              const uploadedImage = await Canvas.loadImage(attachment.url);
        
              const originalWidth = uploadedImage.width;
              const originalHeight = uploadedImage.height;
        
              // Maintain aspect ratio
              const maxImageWidth = 1169;
              const maxImageHeight = 583;
              const scaleFactor = Math.min(maxImageWidth / originalWidth, maxImageHeight / originalHeight);
              const imgWidth = originalWidth * scaleFactor;
              const imgHeight = originalHeight * scaleFactor;
        
              const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
              const ctx = canvas.getContext('2d');
              ctx.textAlign = 'left'; // Align text to the left for subtitle
              ctx.textBaseline = 'middle';
        
              ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
        
              // Draw the uploaded image
              const imgX = (canvasWidth - imgWidth) / 2;
              const imgY = (canvasHeight - imgHeight) / 2 - 140; // Adjust Y position as needed
              ctx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);
        
              // Title (Bold)
              ctx.font = 'bold 140px Decalo';
              ctx.fillStyle = '#ffffff';
              const titleWidth = ctx.measureText(title).width; 
              const titleX = canvasCenterX - (titleWidth / 2); // Center title horizontally
              const titleY = canvasCenterY + 150; // Adjust Y position as needed
              ctx.fillText(title, titleX, titleY);
        
              // Subtitle (SemiBold)
              ctx.font = '600 25px Decalo';
              ctx.fillStyle = '#dddddd';
              const subtitleX = titleX; // Start subtitle from the left side of the title
              const subtitleY = titleY + 100; // Position subtitle below the title
              ctx.fillText(subtitle, subtitleX, subtitleY);
        
              const attachmentBuffer = canvas.toBuffer();
              message.channel.send({ files: [{ attachment: attachmentBuffer, name: 'thumbnail.png' }] });}
       catch (error) {
        console.error('Error generating thumbnail:', error);
        message.reply('There was an error generating your thumbnail. Please try again.');
      }
    },
  },
};

// Event: When the bot is ready
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
// Event: When a message is created
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  // Check if the message starts with a command prefix
  if (message.content.startsWith('!')) {
    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // If the user types just "!", show the command list
    if (commandName === '') {
      const commandList = Object.keys(commands)
        .map((cmd) => `**!${cmd}**: ${commands[cmd].description}`)
        .join('\n');
      return message.reply(`Type a command after "!" to use it. Here are the available commands:\n${commandList}`);
    }

    // Check if the command exists
    if (commands[commandName]) {
      try {
        await commands[commandName].execute(message, args);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        message.reply('There was an error executing that command.');
      }
    } else {
      // If the command doesn't exist, show the help command
      message.reply(`Command not found. Use **!help** to see available commands.`);
    }
  }
});

// Login to Discord
client.login(token);