require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var rp = require('request-promise-native');

const PORT = '9000';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/ui',express.static(path.join(__dirname + '/test' )));
let gender = 'F';
let loop_flag = 0;
let clock_enabled = 1;

// receipt variables


const RECEIPT_HEADER = "\n\n-- LIVING ROOM  OF THE FUTURE --\n\n********* Data Receipt *********\n\n"
let time_start = new Date()
time_start.setHours(time_start.getHours()+1)
let time_end = new Date()
time_end.setHours(time_end.getHours()+1);
let sitdown_flag = 0;
let experiment_number = 1;
let time_person_settle = new Date();
time_person_settle.setHours(time_person_settle.getHours()+1)
let network_speed = "264ms latency / 768Mbps"
let room_luminance = "389 lux"
let room_colourimtry = "bri: 254, hue: 40104, sat: 125";
let oyseter_card_picked_up = false;
let textbook_picked_up = false;
let water_picked_up = false;
let jug_picked_up = false;
let receipt_output = "";

var make_receipt = function() {
var diffS = (time_end - time_person_settle)/1000;

var filmChoice = 'A';
if(textbook_picked_up && oyseter_card_picked_up)
  filmChoice = 'B';
if(textbook_picked_up && !oyseter_card_picked_up)
  filmChoice = 'C';
if(!textbook_picked_up && oyseter_card_picked_up)
  filmChoice = 'D';

receipt_output = RECEIPT_HEADER;
receipt_output += "Experiment number: " + experiment_number + "\n\n";
receipt_output += "Personal data processing started\n" + time_start.toISOString() + "\n\n";
receipt_output += "Personal data processing stopped\n" + time_end.toISOString() + "\n\n";
receipt_output += "Audience seated at:\n" + time_person_settle.toISOString() + "\n\n";
receipt_output += "Time in experience:\n" + diffS + " seconds \n\n";

receipt_output += "\n******** Room activity ********" + "\n\n";
receipt_output += "Network speed: " + network_speed + "\n\n";
receipt_output += "Room luminance: " + room_luminance + "\n\n";

receipt_output += "\n******** Your Activity ********" + "\n\n";
receipt_output += "This data includes:" + "\n\n";
receipt_output += "Water drank: " + water_picked_up +  "\n\n"; //water_picked_up
receipt_output += "Number of times the lights were changed: " + "39\n\n"; //this is a fixed number and we know it
receipt_output += "Oyster card picked up: " + oyseter_card_picked_up + "\n\n";
receipt_output += "Text book picked up: " + textbook_picked_up + "\n\n";
receipt_output += "Remote control picked up: " + jug_picked_up + "\n\n"; //jug; water_picked_up
receipt_output += "Data from these were used to\nchoose unique ending: " + filmChoice + "\n\n"; //A/B/C

receipt_output += "\n* Beyond Your Experience Today *" + "\n\n";
receipt_output += "The Living Room of the Future\nDatabox has processed your\npersonal data locally and\nethically within this room.\n";
receipt_output += "We have not shared with any\nthird parties and we have\ndeleted your personal data\nupon exit!" + "\n\n";

receipt_output += "Thank you for participating!" + "\n";
receipt_output += "This experience was developed by\nthe objects of immersion team." + "\n";
receipt_output += "Twitter: @ImmersiveObject" + "\n\n";
receipt_output += "Tweet us about your experience!" + "\n\n";

receipt_output += "" + "\n\n\n\n";
}


var urls = {
  "blind_driver" : "http://127.0.0.1:9091/ui/api/",
  "hue_driver": "http://127.0.0.1:9092/ui/api/",
  "main_speaker_driver" : "http://127.0.0.1:9093/ui/api/",
  "clock_audio_driver" : "http://127.0.0.1:9094/ui/api/",
  "receipt_driver" : "http://127.0.0.1:9095/ui/api/",
  "monitor_driver" : "http://127.0.0.1:9096/ui/api/",
  "fan_driver" :"http://127.0.0.1:9097/ui/api/",
  "nfc_driver": "http://127.0.0.1:9098/ui/api/",
  "sofa_driver": "http://127.0.0.1:9099/ui/api/",
  "uv_driver":  "http://127.0.0.1:9100/ui/api/"
};

var monitor_prompts = {
  "ID002" : "Audience detected... \"Hi! welcome to the Living Room of the Future. Sit down, relax and enjoy your experience!\"",
  "ID006" : "Audience seated... Great, now that you're sat down get comfy... let's dim the lights and close the blind",
  "ID010" : "...",
  "ID011" : "Starting film",
  "ID018" : "Starting fan",
  "ID022" : "Turning fan off",
  "ID080" : "...",
  "ID083" : "Oyster card data analysed... The last visitor left thier oyster card",
  "ID021" : "Change in brightness of film... lights changed",
  "ID096" : "Low hydration level detected... Please stay hydrated :)",
  "ID028" : "Audience attention level checked",
  "ID031" : "Audience excitement level checked",
  "ID090" : "...",
  "ID092" : "...",
  "ID040" : "Film audio switching to radio",
  "ID042" : "Radio off, sound back to main tv",
  "ID046" : "...",
  "ID047" : "58364 dust mites detected in the room... you have 42% chance of developing a respiratory illness if continued at this rate",
  "ID065" : "Look around for connected things",
  "ID053" : "Room temperature high... cooling down",
  "ID089" : "...", 
  "ID073" : "Lights turning back on",
  "ID077" : "Deleting your personal data... printing your receipt... Hope you enjoyed your experience... please take your data receipt! :)",
  "ID109" : "...",
  "ID110" : "...",
};
var monitor_prompts2 = {
  "ID002" : "Participants detected/Aquiring Data/ ... making gender adjustment",
  "ID006" : "Audience Seated / Caulating Mass Index / Adjusting Media Content",
  "ID010" : "Calculating room luminosity - 0x235",
  "ID011" : "Media Objects Adjusted... playing media",
  "ID018" : "Matching wind speed to media objects",
  "ID022" : "Wind speed = 18 MPH, for 16 seconds",
  "ID080" : "Compensating for text book media",
  "ID083" : "Travel card account analysed",
  "ID021" : "Colour matching environment with media",
  "ID096" : "Audience hydration levels detected... media adjusted",
  "ID028" : "Audience attention levels changed",
  "ID031" : "Audience excitement level changed",
  "ID090" : "Waiting for oyster card change",
  "ID092" : "Waiting for book status",
  "ID040" : "Switching on alalouge interface... FM signal transmission starting up... searching for broadcast... radio news alert detected... adjusting media",
  "ID042" : "Turning off analouge interface... switching back to digital",
  "ID046" : "Improving audience comfort and awareness levels",
  "ID047" : "Monitoring audience health levels... you have 32% chance of developing an illness based on room activity and dust levels",
  "ID065" : "Activating Ultra-Violet examination mode",
  "ID053" : "Monitoring temperature of room... cooling room down",
  "ID089" : "Adding additional media to give you time to hydrate", 
  "ID073" : "Adjusting light levels for audience exit",
  "ID077" : "Removing all recorded data... printing data receipt...",
  "ID109" : "Choose media track B becasue you picked up the book",
  "ID110" : "Choose media track C becasue you picked up the oyster card",
};



var blind_up = function () {
  console.log("putting blind up")
  var options = {
      method: 'GET',
      uri: urls["blind_driver"] + 'up',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success blind up")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed blind up", err)
      return("FAIL")
  });
}

var enable_jug = function () {
  console.log("enabling jug");
   var options = {
      method: 'GET',
      uri: urls["nfc_driver"] + 'enable_jug',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success nfc jug enabled")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed enabling jug", err)
      return("FAIL")
  });
}

var disable_jug = function () {
  console.log("disabling Jug");
   var options = {
      method: 'GET',
      uri: urls["nfc_driver"] + 'disable_jug',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success nfc jug disabled")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed disabling jug", err)
      return("FAIL")
  });
}

var blind_down = function () {
  console.log("putting blind down")
  var options = {
      method: 'GET',
      uri: urls["blind_driver"] + 'down',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success blind down")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed blind down", err)
      return("FAIL")
  });
}

var hue_on = function () {
  console.log("tuning hue lights on")
  var options = {
      method: 'GET',
      uri: urls["hue_driver"] + 'on',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success hue on")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed hue on", err)
      return("FAIL")
  });
}

var hue_off = function () {
  console.log("tuning hue lights off")
  var options = {
      method: 'GET',
      uri: urls["hue_driver"] + 'off',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success hue off")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed hue off", err)
      return("FAIL")
  });
}

var hue_20 = function () {
  console.log("setting hue lights to 20%")
  var options = {
      method: 'GET',
      uri: urls["hue_driver"] + '20',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success hue 20")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed hue off", err)
      return("FAIL")
  });
}

var hue_light_script = function (script_id) {
  console.log("setting hue light according to script id: " + script_id)
  let obj = {"script_id": script_id};
  var options = {
      method: 'POST',
      uri: urls["hue_driver"] + 'light_script',
      body: obj,
      json: true
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success scipted")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed scripted", err)
      return("FAIL")
  });
}

var hue_white = function () {
  console.log("setting hue lights white")
  var options = {
      method: 'GET',
      uri: urls["hue_driver"] + 'white',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success hue white")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed hue white", err)
      return("FAIL")
  });
}

var clock_audio = function(file_id) {
  console.log("playing clock audio file: " + file_id)
  if(clock_enabled) {
    let obj = {
    "file_id": file_id
    };
    var options = {
        method: 'POST',
        body: obj,
        uri: urls["clock_audio_driver"] + 'play_file',
        json: true
    };
    rp(options)
    .then(function (parsedBody) {
        console.log("success played file " + file_id)
        return("OK")
    })
    .catch(function (err) {
        console.log("failed playing file", err)
        return("FAIL")
    });
  }else {
    return("OK")
  }
  

}

var stop_clock = function() {
  console.log("stopping clock audio playing");
  var options = {
      method: 'GET',
      uri: urls["clock_audio_driver"] + 'stop',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success stopped clock")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed stopped clock", err)
      return("FAIL")
  });
}

var main_audio_play_1 = function() {
console.log("playing main speaker file 1")
  var options = {
      method: 'GET',
      uri: urls["main_speaker_driver"] + 'play_1',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success playing main speaker file 1")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed playing main speaker file 1", err)
      return("FAIL")
  });
}

var main_audio_play_2 = function() {
  console.log("playing main speaker file 2")
  var options = {
      method: 'GET',
      uri: urls["main_speaker_driver"] + 'play_2',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success playing main speaker file 2")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed playing main speaker file 2", err)
      return("FAIL")
  });
}

var main_audio_play_3 = function() {
  console.log("playing main speaker file 3")
  var options = {
      method: 'GET',
      uri: urls["main_speaker_driver"] + 'play_3',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success playing main speaker file 3")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed playing main speaker file 3", err)
      return("FAIL")
  });
}

var stop_main = function() {
  console.log("stopping main speakers")
  var options = {
      method: 'GET',
      uri: urls["main_speaker_driver"] + 'stop',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success stopping main speakers")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed stopping main speakes", err)
      return("FAIL")
  });
}

var uv_on = function () {
  console.log("tuning uv light on")
  var options = {
      method: 'GET',
      uri: urls["uv_driver"] + 'on',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success uv light on")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed uv light on", err)
      return("FAIL")
  });
}

var uv_off = function () {
  console.log("tuning uv light off")
  var options = {
      method: 'GET',
      uri: urls["uv_driver"] + 'off',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success uv light off")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed uv light off", err)
      return("FAIL")
  });
}

var receipt = function (text) {
  console.log("receipt printing " + text)
  let obj = {"text": text};
  var options = {
      method: 'POST',
      body: obj,
      uri: urls["receipt_driver"] + 'print',
      json: true
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success receipt printed")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed printing receipt", err)
      return("FAIL")
  });
}

var send_monitor = function (text) {
  console.log("outputting to monitor " + text)
  let obj = {
    "text": text,
    "size": 1
  };
  var options = {
      method: 'POST',
      body: obj,
      uri: urls["monitor_driver"] + 'send',
      json: true
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success sending to monitor")
      return("OK")
  })
  .catch(function (err) {
      console.log("success sending to monitor", err)
      return("FAIL")
  });
}

var clear_monitor = function (text, size) {
  console.log("clearing monitor screen")
  var options = {
      method: 'GET',
      uri: urls["monitor_driver"] + 'clear',
      json: true
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success monitor clearing")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed monitored clearing", err)
      return("FAIL")
  });
}

var fan_on = function() {
  console.log("turning fan on high")
  var options = {
      method: 'GET',
      uri: urls["fan_driver"] + 'fan_cool_high',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success fan_cool_high")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed fan_cool_high", err)
      return("FAIL")
  });
}

var fan_off = function() {
  console.log("turning fan off")
  var options = {
      method: 'GET',
      uri: urls["fan_driver"] + 'fan_off',
      json: false
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success fan_off")
      return("OK")
  })
  .catch(function (err) {
      console.log("failed fan_off", err)
      return("FAIL")
  });
}

app.get('/ui/api/receipt_test', function (req, res, next) {
  make_receipt();
  receipt(receipt_output);
  res.send("OK");
});

app.get('/ui/api/oyster_used', function (req, res, next) {
  console.log("setting oyster card to used")
  if(!oyseter_card_picked_up){
    send_monitor("Oyster card data analysed... the last visitor left thier oyster card");
  }
  oyseter_card_picked_up = true;
  res.send("OK");
});

app.get('/ui/api/water_used', function (req, res, next) {
  if(!water_picked_up){
    send_monitor("Low hydration levels detected... please stay hydrated");
  }
  console.log("setting water to used")
  water_picked_up = true;
  res.send("OK");
});

app.get('/ui/api/book_used', function (req, res, next) {
  if(!textbook_picked_up){
    send_monitor("Enjoy the book... you'll find more info about the building in the film");
  }
  console.log("setting textbook to used")
  textbook_picked_up = true;
  res.send("OK");
});

app.get('/ui/api/jug_used', function (req, res, next) {
  if(!jug_picked_up){
    send_monitor("Do you think that remotes will really by used in the living room of the future?")
    clock_audio("ID112")
  }
  console.log("setting jug to used")
  jug_picked_up = true;
  res.send("OK");
});

app.get('/ui/api/get_oyster_used', function (req, res, next) {
  console.log("checking if oyster card is used, result is: " + oyseter_card_picked_up);
  if(oyseter_card_picked_up == true)
    res.send(JSON.stringify({"state": 1}, null, 3))
  else
  res.send(JSON.stringify({"state": 0}, null, 3))
});

app.get('/ui/api/get_textbook_used', function (req, res, next) {
  console.log("checking if textbook is used, result is: " + textbook_picked_up);
  if(textbook_picked_up == true)
    res.send(JSON.stringify({"state": 1}, null, 3))
  else
    res.send(JSON.stringify({"state": 0}, null, 3))
});

app.get('/ui/api/get_water_used', function (req, res, next) {
  console.log("checking if water is used, result is: " + water_picked_up);
  if(water_picked_up == true)
    res.send(JSON.stringify({"state": 1}, null, 3))
  else
    res.send(JSON.stringify({"state": 0}, null, 3))
});

app.get('/ui/api/ID-000', function (req, res, next) {
  console.log('[info] hit 000' )
  console.log("setting oyster card, textbook and water used to false");
  console.log("setting sitdown_flag to false");
  loop_flag = 0;
  oyseter_card_picked_up = false;
  textbook_picked_up = false;
  water_picked_up = false;
  jug_picked_up = false;
  sitdown_flag = 0;
  uv_off();
  fan_off();
  stop_main();
  hue_white();
  blind_up();
  clear_monitor();
  enable_jug();
  console.log("setting experiment start time to: " + time_start.toISOString());
  time_start = new Date();
  time_start.setHours(time_start.getHours()+1)
  experiment_number++;
  res.send("OK");
});

app.get('/ui/api/ID-002', function (req, res, next) {
  console.log('[info] hit 002' )
  var today = new Date()
  today.setHours(today.getHours()+1)
  var curHr = today.getHours()
   if(gender == "M"){
    gender = "F";
  }else {
    gender = "M";
  }
  if (curHr < 12) {
    clock_audio("ID002-MOR-" + gender);
  } else if (curHr < 18) {
    clock_audio("ID002-AFT-" + gender);
  } else {
    clock_audio("ID002-EVE-" + gender);
  }

  setTimeout(()=>{
    clock_audio("ID002-WEL-"+ gender)
    send_monitor(monitor_prompts["ID002"])
  }, 1500);
  res.send("OK");
});


app.get('/ui/api/ID-004', function (req, res, next) {
  console.log('[info] hit 004' )
  let number = Math.floor(Math.random() * Math.floor(3))+1;
  clock_audio("ID004-"+number+"-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-006', function (req, res, next) {
  console.log('[info] hit 006' )
  send_monitor(monitor_prompts["ID006"]);
  res.send("OK");
});

app.get('/ui/api/ID-007', function (req, res, next) {
  console.log('[info] hit 007' )
  time_person_settle = new Date();
  time_person_settle.setHours(time_person_settle.getHours() + 1)
  console.log('setting person settle time to:' + time_person_settle.toISOString());
  blind_down();
  res.send("OK");
});

app.get('/ui/api/ID-008', function (req, res, next) {
  console.log('[info] hit 008' )
  setTimeout(function(){hue_20();}, 4000);
  res.send("OK");
});

app.get('/ui/api/ID-010', function (req, res, next) {
  console.log('[info] hit 010' )
  //send_monitor(monitor_prompts["ID010"]);
  clock_audio("ID010-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-013', function (req, res, next) {
  console.log('[info] hit 013' )
  res.send("OK");
});

app.get('/ui/api/ID-011', function (req, res, next) {
  console.log('[info] hit 011' )
  send_monitor(monitor_prompts["ID011"]);
  main_audio_play_1();
  res.send("OK");
});

app.get('/ui/api/ID-016', function (req, res, next) {
  console.log('[info] hit 016' )
  hue_light_script("ID016");
  res.send("OK");
});

app.get('/ui/api/ID-018', function (req, res, next) {
  console.log('[info] hit 018' )
  send_monitor(monitor_prompts["ID018"]);
  fan_on();
  res.send("fan is on");
});

app.get('/ui/api/ID-100', function (req, res, next) {
  console.log('[info] hit 100' )
  fan_off();
  res.send("fan is off");
});

app.get('/ui/api/ID-022', function (req, res, next) {
  console.log('[info] hit 022' )
  send_monitor(monitor_prompts["ID022"]);
  res.send("OK");
});

app.get('/ui/api/ID-021', function (req, res, next) {
  console.log('[info] hit 021' )
  send_monitor(monitor_prompts["ID021"]);
  hue_light_script("ID021");
  res.send("OK");
});

app.get('/ui/api/ID-088', function (req, res, next) {
  console.log('[info] hit 088' )
  //clock_audio("ID054-WGW-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-106', function (req, res, next) {
  console.log('[info] hit 106' )
  hue_light_script("ID106");
  res.send("OK");
});

app.get('/ui/api/ID-028', function (req, res, next) {
  console.log('[info] hit 028' )
  send_monitor(monitor_prompts["ID028"]);
  hue_light_script("ID028");
  clock_audio("ID028-COM-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-031', function (req, res, next) {
  console.log('[info] hit 031' )
  send_monitor(monitor_prompts["ID031"]);
  res.send("OK");
});

app.get('/ui/api/ID-033', function (req, res, next) {
  console.log('[info] hit 033' )
  
  if(loop_flag == 0){
    console.log("hit loop flag first time");
    loop_flag = 1;
  } else {
    console.log("hit loop flag second time");
    loop_flag = 0
    main_audio_play_2();
    hue_on();
    uv_off();
    enable_jug();
  }
  
  res.send("OK");
});

app.get('/ui/api/ID-034', function (req, res, next) {
  console.log('[info] hit 034' )
  res.send("OK");
});

app.get('/ui/api/ID-041', function (req, res, next) {
  console.log('[info] hit 041' )
  res.send("OK");
});

app.get('/ui/api/ID-040', function (req, res, next) {
  console.log('[info] hit 040' )
  send_monitor(monitor_prompts["ID040"]);
  hue_light_script("ID040");
  clock_audio("ID040");
  res.send("OK");
});

app.get('/ui/api/ID-042', function (req, res, next) {
  console.log('[info] hit 042' )
  send_monitor(monitor_prompts["ID042"]);
  hue_light_script("ID042");
  stop_clock()
  res.send("OK");
});

app.get('/ui/api/ID-046', function (req, res, next) {
  console.log('[info] hit 046' )
  // send_monitor(monitor_prompts["ID046"]);
  hue_light_script("ID046");
  res.send("OK");
});

app.get('/ui/api/ID-047', function (req, res, next) {
  console.log('[info] hit 047' )
  send_monitor(monitor_prompts["ID047"]);
  hue_light_script("ID047");
  // data monitor log HDI health provoker "you have X chance of dying etc"
  res.send("OK");
});

app.get('/ui/api/ID-050', function (req, res, next) {
  console.log('[info] hit 050' )
  // NULL
  res.send("OK");
});

app.get('/ui/api/ID-052', function (req, res, next) {
  console.log('[info] hit 052' )
  // data tablet output "room is playing media slow so you can drink"
  res.status(200).send("OK");
});

app.get('/ui/api/ID-089', function (req, res, next) {
  console.log('[info] hit 089' )
  //send_monitor(monitor_prompts["ID089"]);
  res.send("OK");
});

app.get('/ui/api/ID-059', function (req, res, next) {
  console.log('[info] hit 059' )
  // NULL
  res.send("OK");
});

app.get('/ui/api/ID-074', function (req, res, next) {
  console.log('[info] hit 074' )
  // NULL
  res.send("OK");
});

app.get('/ui/api/ID-061', function (req, res, next) {
  console.log('[info] hit 061' )
  hue_light_script("061");
  clock_audio("ID061");
  res.send("OK");
});

app.get('/ui/api/ID-072', function (req, res, next) {
  console.log('[info] hit 072' )
  hue_light_script("072");
  blind_up();
  res.send("OK");
});

app.get('/ui/api/ID-073', function (req, res, next) {
  console.log('[info] hit 073' )
  send_monitor(monitor_prompts["ID073"]);
  hue_white();
  res.send("OK");
});

app.get('/ui/api/ID-076', function (req, res, next) {
  console.log('[info] hit 076' )
  hue_light_script("061");
  clock_audio("ID076-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-077', function (req, res, next) {
  console.log('[info] hit 077' )
  time_end = new Date();
  time_end.setHours(time_end.getHours()+1)
  send_monitor(monitor_prompts["ID077"]);
  make_receipt();
  receipt(receipt_output);
  res.send("OK");
});

app.get('/ui/api/ID-078', function (req, res, next) {
  console.log('[info] hit 078' )
  res.send("OK");
});

app.get('/ui/api/ID-095', function (req, res, next) {
  console.log('[info] hit 095' )
  hue_light_script("ID095");
  res.send("OK");
});

app.get('/ui/api/ID-096', function (req, res, next) {
  console.log('[info] hit 096' )
  send_monitor(monitor_prompts["ID096"]);
  hue_light_script("ID096");
  res.send("OK");
});

app.get('/ui/api/ID-098', function (req, res, next) {
  console.log('[info] hit 098' )
  hue_light_script("ID098")
  fan_off();
  res.send("OK");
});

app.get('/ui/api/ID-099', function (req, res, next) {
  console.log('[info] hit 099' )
  main_audio_play_3()
  res.status(200).send("OK");
});

app.get('/ui/api/ID-090', function (req, res, next) {
  console.log('[info] hit 090' )
  
  res.send("OK");
});

app.get('/ui/api/ID-091', function (req, res, next) {
  console.log('[info] hit 091' )
  hue_light_script("ID091");
  res.send("OK");
});

app.get('/ui/api/ID-092', function (req, res, next) {
  console.log('[info] hit 092' )
  res.send("OK");

});

app.get('/ui/api/ID-093', function (req, res, next) {
  console.log('[info] hit 093' )
  hue_light_script("ID093");
  res.send("OK");
});

app.get('/ui/api/ID-065', function (req, res, next) {
  console.log('[info] hit 065' )
  send_monitor(monitor_prompts["ID065"]);
  disable_jug();
  uv_on();
  hue_off();
  res.send("OK");
});

app.get('/ui/api/ID-066', function (req, res, next) {
  console.log('[info] hit 066' )
  clock_audio("ID066-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-067', function (req, res, next) {
  console.log('[info] hit 067' )
  res.send("OK");
});

app.get('/ui/api/ID-068', function (req, res, next) {
  console.log('[info] hit 068')
  res.send("OK");
});

app.get('/ui/api/ID-069', function (req, res, next) {
  console.log('[info] hit 067')
  res.send("OK");
});

app.get('/ui/api/ID-084', function (req, res, next) {
  console.log('[info] hit 084' )
  console.log('checking if someone has sat down')
  res.setHeader('Content-Type', 'application/json');
   var options = {
      method: 'GET',
      uri: urls["sofa_driver"] + 'get_sat_down',
      json: true
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("got sofa status")
      console.log(parsedBody);
      res.send(JSON.stringify(parsedBody, null, 3));
  })
  .catch(function (err) {
      console.log("failed to get sofa status, assuming sat down", err)
      res.send(JSON.stringify({"state": 1}, null, 3));
  });

});

app.get('/ui/api/ID-056', function (req, res, next) {
  console.log('[info] hit 056' )
  console.log('checking if drink has been used')
  if(water_picked_up){
    res.json({"state": 1});
  }else
  {
    res.json({"state": 0});
  }

});

app.get('/ui/api/ID-086', function (req, res, next) {
  console.log('[info] hit 086' )
  console.log('checking if drink has been used')
  if(water_picked_up){
    res.json({"state": 1});
  }else
  {
    res.json({"state": 0});
  }
});


app.get('/ui/api/ID-101', function (req, res, next) {
  console.log('[info] hit 101' )
  hue_light_script("ID101")
  res.send("OK");
});

app.get('/ui/api/ID-102', function (req, res, next) {
  console.log('[info] hit 102' )
  hue_light_script("ID102");
  
  res.send("OK");
});

app.get('/ui/api/ID-103', function (req, res, next) {
  console.log('[info] hit 103' )
  hue_light_script("ID103");
  res.send("OK");
});

app.get('/ui/api/ID-104', function (req, res, next) {
  console.log('[info] hit 104' )
  hue_light_script("ID104");
  res.send("OK");
});

app.get('/ui/api/ID-105', function (req, res, next) {
  console.log('[info] hit 105' )
  hue_light_script("ID105");
  res.send("OK");
});

app.get('/ui/api/ID-053', function (req, res, next) {
  console.log('[info] hit 053' )
  send_monitor(monitor_prompts["ID053"]);
  hue_light_script("ID053");
  res.send("OK");
});

app.get('/ui/api/ID-113', function (req, res, next) {
  console.log('[info] hit 113' )
  fan_on();
  res.send("OK");
});

app.get('/ui/api/ID-054', function (req, res, next) {
  console.log('[info] hit 054' )
  //clock_audio("ID054-AYT-" + gender);
  res.send("OK");
});

app.get('/ui/api/ID-110', function (req, res, next) {
  console.log('[info] hit 110' )
  //send_monitor(monitor_prompts["ID110"]);
  clock_audio("ID082");
  res.send("OK");
});

app.get('/ui/api/ID-109', function (req, res, next) {
  console.log('[info] hit 109' )
  //send_monitor(monitor_prompts["ID109"]);
  clock_audio("ID081");
  res.send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);
