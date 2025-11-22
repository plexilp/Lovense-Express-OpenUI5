# Cordova-Integration für LovApp

Diese Anleitung beschreibt die Einrichtung und Nutzung der Cordova-Integration für die LovApp.

## Voraussetzungen

- Node.js und npm installiert
- Cordova CLI global installiert: `npm install -g cordova`
- Für Android: Android Studio und Android SDK
- Für iOS: Xcode (nur auf macOS)

## Installation

1. **Dependencies installieren**

   ```bash
   cd frontend/de.plexdev.lovapp
   npm install
   ```

2. **Cordova-Plattformen hinzufügen**

   ```bash
   cordova platform add android
   cordova platform add ios  # nur auf macOS
   ```

3. **Backend-URL konfigurieren**
   Bearbeite `webapp/config-mobile.json` und trage die URL deines Backend-Servers ein:
   ```json
   {
     "mobile": {
       "backend-url": "https://your-server-ip-or-domain.com",
       "backend-port": 8081,
       "use-ssl": true
     }
   }
   ```

## Build & Run

### Android

**Entwicklung im Emulator:**

```bash
npm run cordova:emulate:android
```

**Auf echtem Gerät:**

```bash
npm run cordova:run:android
```

**Release-Build erstellen:**

```bash
npm run cordova:build:android -- --release
```

### iOS (nur macOS)

**Entwicklung im Simulator:**

```bash
npm run cordova:emulate:ios
```

**Auf echtem Gerät:**

```bash
npm run cordova:run:ios
```

**Release-Build erstellen:**

```bash
npm run cordova:build:ios -- --release
```

## Verfügbare NPM-Skripte

- `npm run cordova:prepare` - Baut die UI5-App und bereitet Cordova vor
- `npm run cordova:build:android` - Baut die Android-APK
- `npm run cordova:build:ios` - Baut die iOS-App
- `npm run cordova:run:android` - Startet die App auf einem Android-Gerät
- `npm run cordova:run:ios` - Startet die App auf einem iOS-Gerät
- `npm run cordova:emulate:android` - Startet die App im Android-Emulator
- `npm run cordova:emulate:ios` - Startet die App im iOS-Simulator

## Native Features

Die App nutzt folgende Cordova-Plugins:

### 1. Vibration (`cordova-plugin-vibration`)

```javascript
// Einfache Vibration
CordovaPluginManager.vibrate(500); // 500ms

// Muster: [vibrieren, pause, vibrieren, ...]
CordovaPluginManager.vibrate([100, 50, 100, 50, 200]);

// Vibration stoppen
CordovaPluginManager.cancelVibration();
```

### 2. Device Motion (`cordova-plugin-device-motion`)

Für Shake-Detection:

```javascript
const watcher = CordovaPluginManager.watchAcceleration((acceleration) => {
  console.log("Shake detected!", acceleration);
}, 15); // Threshold

// Später stoppen:
watcher.clear();
```

### 3. Media (`cordova-plugin-media`)

Für Sound-Wiedergabe:

```javascript
const media = CordovaPluginManager.playSound("path/to/sound.mp3");
```

### 4. Device Info (`cordova-plugin-device`)

```javascript
const info = CordovaPluginManager.getDeviceInfo();
// { platform: 'Android', version: '12', model: 'Pixel 5', ... }
```

### 5. Network Information (`cordova-plugin-network-information`)

```javascript
const network = CordovaPluginManager.getNetworkInfo();
// { type: 'wifi', isOnline: true }
```

## CordovaPluginManager

Alle nativen Features sind über den `CordovaPluginManager` verfügbar. Er bietet:

- Automatisches Fallback auf Web-APIs wenn Cordova nicht verfügbar
- Einheitliche API für Web und Mobile
- Gerätestatus-Prüfungen

Verwendung in Controllern:

```javascript
sap.ui.define(
  [
    "de/plexdev/lovapp/controller/BaseController",
    "de/plexdev/lovapp/controller/CordovaPluginManager",
  ],
  function (BaseController, CordovaPluginManager) {
    return BaseController.extend("...", {
      async onAfterRendering() {
        // Warte auf Cordova deviceready
        await CordovaPluginManager.deviceReady();

        // Prüfe ob Cordova läuft
        if (CordovaPluginManager.isCordova()) {
          // Nutze native Features
        }
      },
    });
  }
);
```

## WebSocket-Verbindung

Die App verbindet sich automatisch mit dem Backend über WebSocket:

- **Web-Version**: Nutzt `localhost` oder relative URL
- **Mobile App**: Nutzt konfigurierte Backend-URL aus `config-mobile.json`

Die WebSocket-Verbindung wird automatisch beim App-Start initialisiert.

## Troubleshooting

### App startet nicht

- Prüfe ob alle Dependencies installiert sind: `npm install`
- Stelle sicher dass Android SDK oder Xcode korrekt konfiguriert sind
- Prüfe `cordova requirements` für fehlende Abhängigkeiten

### WebSocket-Verbindung fehlgeschlagen

- Prüfe die Backend-URL in `config-mobile.json`
- Stelle sicher dass das Backend läuft und erreichbar ist
- Bei SSL: Stelle sicher dass das Zertifikat gültig ist

### Plugins funktionieren nicht

- Prüfe ob Plugins installiert sind: `cordova plugin list`
- Stelle sicher dass `deviceready` Event abgewartet wurde
- Prüfe Browser-Console für Fehler

### Build-Fehler

- Lösche `platforms/` und `plugins/` Ordner
- Führe `cordova platform add android/ios` erneut aus
- Prüfe Cordova-Version: `cordova --version`

## Deployment

### Android APK signieren

1. **Keystore erstellen:**

   ```bash
   keytool -genkey -v -keystore lovapp.keystore -alias lovapp -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **build.json erstellen:**

   ```json
   {
     "android": {
       "release": {
         "keystore": "lovapp.keystore",
         "storePassword": "password",
         "alias": "lovapp",
         "password": "password"
       }
     }
   }
   ```

3. **Release-Build:**
   ```bash
   cordova build android --release
   ```

### iOS App Store

1. Öffne `platforms/ios/LovApp.xcworkspace` in Xcode
2. Konfiguriere Signing & Capabilities
3. Wähle "Generic iOS Device" als Target
4. Product → Archive
5. Distribute App → App Store Connect

## Weitere Ressourcen

- [Cordova Dokumentation](https://cordova.apache.org/docs/en/latest/)
- [Cordova Plugins](https://cordova.apache.org/plugins/)
- [SAPUI5 Mobile Guidelines](https://sapui5.hana.ondemand.com/#/topic/13e6f3bfc54c4bd7952403e20ff447e7)
