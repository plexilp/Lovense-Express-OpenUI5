const consts = {};
consts.CONFIG = {
  ip: "192.168.178.1",
  port: "30010",
};

// consts.ACTIONS = [
//   { key: "Stop", name: "Stop" },
//   { key: "All", name: "Alle" },
//   { key: "Vibrate", name: "Vibrieren" },
//   { key: "Rotate", name: "Rotieren" },
//   { key: "Pump", name: "Pumpen" },
//   { key: "Thrusting", name: "Stoßen" },
//   { key: "Fingering", name: "Fingern" },
//   { key: "Suction", name: "Saugen" },
//   { key: "Depth", name: "Tiefe" },
// ];

// consts.RULES = [
//   { key: "v", name: "Vibrieren" },
//   { key: "r", name: "Rotieren" },
//   { key: "p", name: "Pumpen" },
//   { key: "t", name: "Stoßen" },
//   { key: "f", name: "Fingern" },
//   { key: "s", name: "Saugen" },
//   { key: "d", name: "Tiefe" },
//   { key: "", name: "Alle" },
// ];

consts.ACTIONS = {
  Stop: "Stop",
  All: "All",
  Vibrate: "Vibrate",
  Vibrate1: "Vibrate1", //Gemini Left, or specific Motor
  Vibrate2: "Vibrate2", //Gemini Right, or specific Motor
  Vibrate2: "Vibrate3", //Specific Motor
  Rotate: "Rotate",
  Pump: "Pump",
  Thrusting: "Thrusting",
  Fingering: "Fingering",
  Suction: "Suction",
  Depth: "Depth",
};

consts.ACTION_DETAILS = [
  { key: "Stop", name: "Stop", minStrength: 0, maxStrength: 0 },
  { key: "All", name: "Alle", minStrength: 0, maxStrength: 20 },
  { key: "Vibrate", name: "Vibrieren", minStrength: 0, maxStrength: 20 },
  { key: "Rotate", name: "Rotieren", minStrength: 0, maxStrength: 20 },
  { key: "Pump", name: "Pumpen", minStrength: 0, maxStrength: 3 },
  { key: "Thrusting", name: "Stoßen", minStrength: 0, maxStrength: 20 },
  { key: "Fingering", name: "Fingern", minStrength: 0, maxStrength: 20 },
  { key: "Suction", name: "Saugen", minStrength: 0, maxStrength: 20 },
  { key: "Depth", name: "Tiefe", minStrength: 0, maxStrength: 3 },
];

consts.RULES = {
  All: "",
  Vibrate: "v",
  Rotate: "r",
  Pump: "p",
  Thrusting: "t",
  Fingering: "f",
  Suction: "s",
  Depth: "d",
};

consts.COMMANDS = {
  Function: "Function",
  Pattern: "Pattern",
  Preset: "Preset",
  GetToys: "GetToys",
  GetToyNames: "GetToyNames",
};

consts.RESPONSE_CODES = {
  200: "Success",
  400: "Invalid Command",
  401: "Toy Not Found",
  402: "Toy Not Connected",
  403: "Toy Doesn't Support This Command",
  404: "Invalid Parameter",
  500: "HTTP server not started or disabled",
  506: "Server Error. Restart Lovense Connect",
};

//Later works with database
consts.MODES = [
  { key: "random", name: "Random", description: "1,5,7,2,4" },
  { key: "stair", name: "Treppe", description: "1,2,3,4,5" },
  { key: "wave", name: "Welle", description: "1,2,3,4,3,2,1" },
  { key: "symmetric", name: "Symmetrisch", description: "1,6,2,5,3,4" },
  { key: "custom", name: "Custom", description: "" },
];

consts.PRESETS = {
  pulse: "pulse",
  wave: "wave",
  fireworks: "fireworks",
  earthquake: "earthquake",
};

module.exports = consts;
