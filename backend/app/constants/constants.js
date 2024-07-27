const configFile = require("../../../config.json");
const consts = {};
consts.CONFIG = {
  ip: configFile["lovense"]["default-ip"],
  port: configFile["lovense"]["default-port"],
};

consts.ARR_RULES = [
  { key: "v", name: "Vibrieren" },
  { key: "r", name: "Rotieren" },
  { key: "p", name: "Pumpen" },
  { key: "t", name: "Stoßen" },
  { key: "f", name: "Fingern" },
  { key: "s", name: "Saugen" },
  { key: "d", name: "Tiefe" },
  { key: "", name: "Alle" },
];

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

consts.ARR_ACTIONS = [
  {
    key: "Vibrate",
    shortKey: "v",
    name: "Vibrieren",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Vibrate1",
    shortKey: "v",
    name: "Vibrieren-Motor 1",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Vibrate2",
    shortKey: "v",
    name: "Vibrieren-Motor 2",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Vibrate3",
    shortKey: "v",
    name: "Vibrieren-Motor 3",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Rotate",
    shortKey: "r",
    name: "Rotieren",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Pump",
    shortKey: "p",
    name: "Pumpen",
    minStrength: 0,
    maxStrength: 3,
  },
  {
    key: "Thrusting",
    shortKey: "t",
    name: "Stoßen",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Fingering",
    shortKey: "f",
    name: "Fingern",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Suction",
    shortKey: "s",
    name: "Saugen",
    minStrength: 0,
    maxStrength: 20,
  },
  {
    key: "Depth",
    shortKey: "d",
    name: "Tiefe",
    minStrength: 0,
    maxStrength: 3,
  },
  { key: "All", shortKey: "", name: "Alle", minStrength: 0, maxStrength: 20 },
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
consts.ARR_MODES = [
  // { key: "random", name: "Random", description: "1,5,7,2,4" },
  {
    key: "pulse",
    name: "Impuls",
    description: "1,8,1,8,1,8",
    icon: "sap-icon://sort",
    settedMaxStrength: 5,
    settedMinStrength: 0,
    settedTime: 0,
    settedInterval: 500,
    settedToy: "",
    settedFeatures: ["v"],
    latestPattern: "",
  },
  {
    key: "stair",
    name: "Treppe",
    description: "1,2,3,4,5,6,7",
    icon: "sap-icon://trend-up",
    settedMaxStrength: 5,
    settedMinStrength: 0,
    settedTime: 0,
    settedInterval: 500,
    settedToy: "",
    settedFeatures: ["v"],
    stepSize: 1,
    latestPattern: "",
  },
  {
    key: "wave",
    name: "Welle",
    description: "1,2,3,4,5,6,5,4,3,2",
    icon: "sap-icon://sort-ascending",
    settedMaxStrength: 5,
    settedMinStrength: 0,
    settedTime: 0,
    settedInterval: 500,
    settedToy: "",
    settedFeatures: ["v"],
    stepSize: 1,
    latestPattern: "",
  },
  {
    key: "symmetric",
    name: "Symmetrisch",
    description: "1,8,2,7,3,6,4,5",
    icon: "sap-icon://vertical-bar-chart-2",
    settedMaxStrength: 5,
    settedMinStrength: 0,
    settedTime: 0,
    settedInterval: 500,
    settedToy: "",
    settedFeatures: ["v"],
    latestPattern: "",
  },
  // { key: "custom", name: "Custom", description: "" },
];

consts.PRESETS = {
  pulse: "pulse",
  wave: "wave",
  fireworks: "fireworks",
  earthquake: "earthquake",
};

module.exports = consts;
