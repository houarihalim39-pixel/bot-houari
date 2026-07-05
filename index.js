
const { Client, Events, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { TOKEN } = require('./json/confing.json');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

const commands = [
  new SlashCommandBuilder().setName('join').setDescription('Join voice channel').toJSON(),
];

client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    const rest = new REST().setToken(TOKEN);
    await rest.put(Routes.applicationCommands(c.user.id), { body: commands });
});

// 1. كي يطاقيك كاش واحد
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const MY_DISCORD_ID = '1262167092724240524'; 

    if (message.mentions.has(MY_DISCORD_ID)) {
        await message.reply('وي خيي هواري مراهش هنا انا بوت تاعه كي يجي نقوله عليك');
    }
});

// 2. كي تدخل أنت للروم الصوتية
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const MY_DISCORD_ID = '1262167092724240524'; 

    if (newState.member.id === MY_DISCORD_ID && !oldState.channelId && newState.channelId) {
        const textChannel = newState.guild.channels.cache.find(ch => ch.isTextBased());
        if (textChannel) {
            await textChannel.send(`ويي هواري توحشتك خيي`);
        }
    }
});

// 3. أمر /join بالجملة الجديدة تاعك
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'join') {
        const channel = interaction.member.voice.channel;
        if (!interaction.member.voice.channel) {
            return interaction.reply('ادخل للروم الصوتي قبل باش نجي عندك خيي');
        }
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        await interaction.reply('راني هنا صاحبي غي عيطلي و انا نجيك');
    }
});

client.login(TOKEN);
