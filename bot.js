const tmi = require('tmi.js');
//List of trusted users
var trusted_users = [];


// Define configuration options
var opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME,
    '#haleyzlife'
  ]
};

// Create a client with our options
var client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  
  var i;
  for (i = 0; i < msg.length; ++i) {
    if (msg.charAt(i)==' '){
      var index = i;
    }
  }
  const commandName = msg.substring(0,index);
  
  const username = msg.substring(index+1);
  
  if(commandName === '!addtrustbot') {
    if (target.substring(1)==context.username){
      opts.channels.push('#'+ username);
      client.say(target,'You have invited '+ username + ' to be a part of your trusted community PogChamp');
      console.log(`* Executed ${commandName} command`);
    }
  }
  
  else if (commandName === '!trustedusers') {
    client.say(target, 'The trusted users of this channel are: ' + trusted_users.toString());
  }
  else if (commandName === '!trust') {
    if (context.mod || target.substring(1)==context.username) {
      trustuser(username);
      client.say(target, `User ` + username + ` has been trusted.`);
      console.log(`* Executed ${commandName} command`);
    }
    else{
      client.say(target, context.username + ' Sorry you must be a moderator to do that BibleThump')
    }
      
  }
  // Untrust function
  else if (commandName === '!untrust') {
    if (context.mod || target.substring(1)==context.username) {
      untrustuser(username);
      client.say(target, `User ` + username + ` is no longer trusted.`);
      console.log(`* Executed ${commandName} command`);
    }
    else {
      client.say(target, context.username + ' Sorry you must be a moderator to do that BibleThump') 
    }
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}
// Function called when the "dice" command is issued
function trustuser (username) {
  trusted_users.push(username);
  trusted_users = Array.from(new Set(trusted_users))
  localStorage.setItem('userlist',trusted_users)
  // add to trusted user panel
}

function untrustuser (username) {
  trusted_users.delete(username);
  var index = trusted_users.indexOf(username);
  if(index != -1) {
    trusted_users.splice(index, 1);
  }
  // remove from trusted user panel
}



// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
