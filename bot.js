const config = require('config');
const logger = require('./utils/logger');
const Discord = require("discord.js");

const client = new Discord.Client();

const bot = (function () {
    return {
        /**
         * Encuentra códigos hexadecimales de color dentro de una cadena
         * 
         * @param {String} msg la cadena donde se buscarán los códigos hexadecimales
         * @returns {Array} array con los códigos colores hexadecimales encontrados (sin el #)
         */
        findHexColors: msg => {
            const candidateHexCodes = msg.match(/#([a-f0-9]+)\b/gi);
            const hexCodes = candidateHexCodes.filter(code => [4, 5, 7, 9].includes(code.length));
            if (hexCodes === null) {
                return [];
            }

            return hexCodes.map(code => {
                if (code.length <= 5) {
                    // Formato simplificado, hay que duplicar cada dígito
                    return code.split('').map(function (hex) {
                        return hex == '#' ? hex : hex + hex;
                    }).join('');
                }
                return code;
            });
        },
        /**
         * Envía un mensaje al servidor
         * 
         * @param {Array} hexColors array con colores hexadecimales sin el hash (#)
         * @param {Discord.Message.Channel} channel el channel al que se enviará el mensaje
         */
        sendHexColors: (hexColors, channel) => {
            if (hexColors === null) {
                return;
            }

            hexColors.forEach(color => {
                const digits = color.substr(1, 6);
                const transparency = color.substr(7, 2);

                let embed = new Discord.MessageEmbed()
                    .setTitle(`${color}`)
                    .setURL(`https://www.colorhexa.com/${digits}`)
                    .setImage(`https://singlecolorimage.com/get/${digits}/200x32`)
                    .setColor(digits);

                if (transparency !== '') {
                    const transparencyPercentage = parseInt(transparency, 16) / 255;
                    embed.setDescription(`Transparencia: ${transparencyPercentage}`);
                }

                // Envía el color al canal en formato embed
                channel.send(embed);

                logger.info(`enviado: ${color}`);
            });
        }
    }
}());


// Eventos del cliente
client.on("message", function (msg) {
    if (msg.author.bot) return;

    bot.sendHexColors(bot.findHexColors(msg.content), msg.channel);
});


// Inicia el cliente
client.login(config.get("bot.token"));