# rotatron

This is a bot that you can use to manage rotas, which are assigned rotations of Slack users. You can create rotas on different update schedules and add users to them, and they will be reminded when their shift is happening.

rotatron is built using botkit. To run it, you must first set up an app in Slack to get an API key. Once you have that and have node installed locally, you can run:

```token=<API KEY> node bot.js```

and then begin sending commands to the bot. DM ```help``` to the bot to get a list of commands.