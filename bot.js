var Botkit = require('botkit/lib/Botkit');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
  debug: false
});


controller.spawn({
  token: process.env.token
}).startRTM(function (err) {
  if (err) {
    throw new Error(err);
  }
});

var rotas = [];

function addRota(existingRotas, name) {
  return [...existingRotas, { name }];
}

function enroll(rotaName, username) {
  const rota = rotas.find(r => r.name === username);
  const enrolled = rota && (rota.enrolled.includes(username) ? rota.enrolled : [...rota.enrolled, username]); 
  return rota && Object.assign({}, rota, { enrolled});
}

function onHearFromAnywhere(commands, callback) {
  controller.hears(commands, ['direct_message', 'direct_mention', 'mention'], callback);
}

function formatRotas(rotas) {
  return rotas.map(r => r.name).join(', ');
}

function formatRotasForSelection(rotas) {
  return rotas.map((r, index) => `(${index}) ${r.name}`)
}

onHearFromAnywhere(['list'], (bot, message) => {
  if (rotas.length == 0) {
    bot.reply(message, 'There are no rotas defined. Response with add to create a new one.')
  }
  else {
    bot.reply(message, `Rotas: ${formatRotas(rotas)}`)
  }
});

onHearFromAnywhere(['add'], (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.addQuestion('What is the name of the rota you would like to create?', (response, convo) => {
      rotas = addRota(rotas, response.text);
      convo.say(`A rota named "${response.text}" has been added!`);
      convo.next();
    }, {}, 'default');
  });
});

onHearFromAnywhere(['enroll'], (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    if (rotas.length) {
      convo.say('No rotas have been added. Please add one before attempting to enroll.');
      convo.next();
      return;
    }

    convo.addQuestion(`For which rota do you want to enroll? ${formatRotasForSelection(rotas)}`, (response, convo) => {
      convo.say(`You chose ${response.text}.`);
      convo.next();
    }, {}, 'default');
  });
})

controller.hears(['hello', 'hi'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  bot.reply(message, "Hello.");
});

controller.hears(['attach'], ['direct_message', 'direct_mention'], function (bot, message) {

  var attachments = [];
  var attachment = {
    title: 'This is an attachment',
    color: '#FFCC99',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: 'A longish value',
    short: false,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachments.push(attachment);

  bot.reply(message, {
    text: 'See below...',
    attachments: attachments,
  }, function (err, resp) {
    console.log(err, resp);
  });
});

controller.hears(['dm me'], ['direct_message', 'direct_mention'], function (bot, message) {
  bot.startConversation(message, function (err, convo) {
    convo.say('Heard ya');
  });

  bot.startPrivateConversation(message, function (err, dm) {
    dm.say('Private reply!');
  });

});
