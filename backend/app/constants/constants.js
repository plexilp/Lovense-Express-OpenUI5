const consts = {};
consts.CONFIG = {
  ip: "192.168.178.1",
  port: "30010",
};

consts.ACTIONS = [
  { key: "Stop", name: "Stop" },
  { key: "All", name: "Alle" },
  { key: "Vibrate", name: "Vibrieren" },
  { key: "Rotate", name: "Rotieren" },
  { key: "Pump", name: "Pumpen" },
  { key: "Thrusting", name: "Stoßen" },
  { key: "Fingering", name: "Fingern" },
  { key: "Suction", name: "Saugen" },
  { key: "Depth", name: "Tiefe" },
];

consts.RULES = [
  { key: "v", name: "Vibrieren" },
  { key: "r", name: "Rotieren" },
  { key: "p", name: "Pumpen" },
  { key: "t", name: "Stoßen" },
  { key: "f", name: "Fingern" },
  { key: "s", name: "Saugen" },
  { key: "d", name: "Tiefe" },
  { key: "", name: "Alle" },
];

//Later works with database
consts.MODES = [
  { key: "random", name: "Random", description: "1,5,7,2,4" },
  { key: "stair", name: "Treppe", description: "1,2,3,4,5" },
  { key: "wave", name: "Welle", description: "1,2,3,4,3,2,1" },
  { key: "symmetric", name: "Symmetrisch", description: "1,6,2,5,3,4" },
  { key: "custom", name: "Custom", description: "" },
];

module.exports = consts;
