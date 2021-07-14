const config = require('config');
const logger = require('./utils/logger');
const Discord = require("discord.js");

const client = new Discord.Client();

const bot = (function () {
    return {
        /**
         * Encuentra códigos hexadecimales de color dentro de una cadena
         * 
         * @param {Discord.Message} msg el mensaje donde se buscarán los códigos hexadecimales
         * @returns {Array} array con los códigos colores hexadecimales encontrados (sin el #)
         */
        findHexColors: msg => {
            const hexCodes = msg.content.match(/#[a-fA-F0-9]+/g);

            if (hexCodes === null) {
                return [];
            }

            const colors = [];
            hexCodes.forEach(code => {
                let color = code.replace("#", "");
                if (color.length === 3) {
                    // Si es un HEX de 3 caracteres lo convierte a 6
                    color = color.split('').map(function (hex) {
                        return hex + hex;
                    }).join('');
                } else if (color.length !== 6) {
                    // Si no es un HEX de 6 caracteres, no lo añade
                    logger.debug(`omitido: ${code}`);
                    return;
                }

                colors.push(color);
            });

            return colors;
        },
        /**
         * Envía un mensaje al servidor
         * 
         * @param {Array} hexColors array con colores hexadecimales sin el hash (#)
         * @param {Discord.Message} msg el mensaje que inició el comando
         */
        sendHexColors: (hexColors, msg) => {
            if (hexColors === null) {
                return;
            }

            hexColors.forEach(color => {
                // Envía el mensaje al canal
                msg.channel.send(
                    new Discord.MessageEmbed()
                        .setTitle(`#${color}`)
                        .setURL(`https://www.colorhexa.com/${color}`)
                        .setImage(`https://singlecolorimage.com/get/${color}/200x32`)
                        .setColor(color)
                );
                logger.info(`enviado: #${color}`);
            });
        }
    }
}());


// Eventos del cliente
client.on("message", function (msg) {
    if (msg.author.bot) return;

    bot.sendHexColors(bot.findHexColors(msg), msg);
});


// Inicia el cliente
client.login(config.get("bot.token"));