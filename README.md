English Version below

# Willkommen

Diese App ist für die besonderen Spielzeuge von der Firma "Lovense".
Für diese Spielzeuge gibt es eine offizielle Handy App und PC App, diese bieten auch viele Möglichkeiten, jedoch möchte so mancher sein Vergnügen genauer steuern können, dafür gibts nun unteranderem meine App.


## Lizenzen:
Ich benutze andere Librarys, von daher ist unter anderem die Lizenz von Apache und ISC enthalten. 
Für mein Coding gilt allerdings die MIT Lizenz.


## Aufbau der App

Die App besteht aus Frontend (OpenUI5) und Backend. Gestartet wird die App wie nachfolgend beschrieben. Sie kann bspw. auf dem Rechner (oder Lokalen Server) gestartet werden, und im gleichen Netz auf anderen Geräten geöffnet werden.

## Einrichten & Starten

Derzeit ist der Start noch etwas schwerer, wenn man nicht so viel mit Programmieren zu tun hat, das wird sich aber im Laufe der Updates verbessern. :)
How to Start:

1. Node Modules installieren
2. Ins Root verzeichnis gehen und npm run install ausführen.
   (Sollte das nicht klappen, in den Ordner "backend" und "de.plexdev.lovapp" und jeweils npm i eingeben)
3. Im Root Verzeichnis: npm run build
4. Im Root Verzeichnis: npm run start
5. Im Browser http:// localhost oder IP :8081/ eingeben. (http://127.0.0.1:8081/)
6. In der Lovense App (Apple, Android oder Windows) den Spiele Modus aktivieren
7. Im Tab "Settings" der Webseite die IP und den Port eingeben und speichern. (alternativ in der config.json ändern und Server neustarten)

Optional ab 3. (Work in Progress)

- Wenn https verwendet werden soll, in config.json den Wert use-https auf true setzen
- Folgende Commands ausführen (in Windows z.B. mit der Git Bash)
  - openssl genrsa -out private.key 2048
  - openssl req -new -key private.key -out cert.csr
  - openssl x509 -req -in cert.csr -signkey private.key -out certificate.crt
- Dann natürlich https:// localhost oder IP :8081 öffnen

Und viel Spaß :)

## Derzeitige Funktionen (Geplantes und teils schon vorhandenes)

Die App besitzt momentan folgende Funktionen:

### Generelles

- Stop Button oben für alle Toys
- Connections Status und aktualisieren Button (Grün: Connected, Rot: Nicht connected), kann zum Auffrischen gedrückt werden

### Home Seite

- Stop Button für jedes einzelne Toy (Home Seite)
- Generelles starten einzelner oder mehrere Geräte mit bestimmter oder unbestimmter Länge und Stärke. Dazu kann immer die passende Funktion (Feature) ausgewählt werden. (Teilweise auch mehrere zugleich)
- Aktuelle Informationen zu den Toys und der App (Batterie, Name, Verbundsstatus) (Diese werden alle 20 Sekunden automatisch aktualisiert)

### Random Seite

- Hier können von-bis Parameter angegeben werden, die App gerneriert daraus dann ein Pattern für das/die ausgewählte/n Toys.
- Man kann Pro Toy oder pro Funktion (Feature) ein eigenes Pattern generieren oder für alle das gleiche verwenden.

### Custom Pattern (Noch nicht verfügbar)

### Sound (Noch nicht verfügbar)

### Predefined Pattern

- Es gibt auch in der Offiziellen App solche vordefinierten Pattern, wie Stairs, oder Impuls, aber diese sind nicht einstellbar. Bei meiner Version kann man da einstellen:
  - von-bis wie viel die Stärke ist
  - wie lange das Pattern laufen soll
  - wie lange ein Interval sein soll, also eine Stärke (in ms)

### Alarm Clock (Noch nicht verfügbar)

- Wecker funktion mit Einstellmöglichkeiten?

### Shake Phone (Noch nicht verfügbar)

- Nur auf dem Handy verfügbar, und wird scannen, wie viel sich das Handy bewegt.
- Dementsprechend wird ein Pattern oder eine Stärke an das Toy gesendet

### Save Options (Noch nicht verfügbar)

- Generelles Customizing, wenn ich mal eine Datenbank im Hintergrund habe (ist derzeit noch nicht der Fall)

### Idle-Game??? (Noch nicht verfügbar)

- Vielleicht ein Spiel, bei dem man sich die Patterns erspielen muss oder so. Weiß noch nicht genau

### Settings

- Einstellen der IP und Port

### Help (Noch nicht verfügbar)

- So Infos wie hier

## Roadmap?!

Eine klare Roadmap habe ich nicht, ich baue, was mir in den Sinn kommt. Ideen sind natürlich aber immer Willkommen :).
Dennoch sind teilweise schon Buttons und Seiten eingebaut, die noch keine Funktion haben, diese kommt vermutlich in Zukunft. (Demnach ist die Roadmap so zu sagen das was unfertig in der App vorzufinden ist.)

Viel Spaß damit :)
PlexDev

---

---

---

---

# English Version

#### Translated with Deepl :)

---

# Welcome

This app is for the special toys from the company ‘Lovense’.
For these toys there is an official mobile phone app and PC app, these also offer many possibilities, but some would like to be able to control their pleasure more precisely, for this there is now my app, among others.

## Licences:

I use other libraries, so the Apache and ISC licences are included.
However, the MIT licence applies to my coding.

## Structure of the app

The app consists of frontend (OpenUI5) and backend. The app is started as described below. It can be started on the computer (or local server), for example, and opened on other devices in the same network.

## Set up & start

At the moment the start is still a little more difficult if you are not so much into programming, but this will improve in the course of the updates. :)
How to Start:

1. install Node Modules
2. go to the root directory and execute npm run install.
   (If this does not work, go to the folder ‘backend’ and ‘de.plexdev.lovapp’ and enter npm i in each case)
3. in the root directory: npm run build
4. in the root directory: npm run start
5. enter http:// localhost or IP :8081/ in the browser. (http://127.0.0.1:8081/)
6. activate the game mode in the Lovense app (Apple, Android or Windows)
7. enter the IP and port in the ‘Settings’ tab of the website and save. (alternatively change in config.json and restart server)

Optional from 3 (work in progress)

- If https is to be used, set the value use-https to true in config.json
- Execute the following commands (in Windows e.g. with the Git Bash)
  - openssl genrsa -out private.key 2048
  - openssl req -new -key private.key -out cert.csr
  - openssl x509 -req -in cert.csr -signkey private.key -out certificate.crt
- Then of course open https:// localhost or IP :8081

And have fun :)

## Current functions (planned and partly already available)

The app currently has the following functions:

### General

- Stop button at the top for all toys
- Connections status and refresh button (green: connected, red: not connected), can be pressed to refresh

### Home page

- Stop button for each individual toy (home page)
- General starting of individual or multiple devices with a specific or undefined length and strength. The appropriate function (feature) can always be selected. (Sometimes several at the same time)
- Current information on the toys and the app (battery, name, network status) (this is updated automatically every 20 seconds)

### Random page

- From-to parameters can be entered here, the app then generates a pattern for the selected toy/toys.
- You can generate a separate pattern per toy or per function (feature) or use the same pattern for all of them.

### Custom Pattern (Not yet available)

### Sound (Not yet available)

### Predefined Pattern

- There are also predefined patterns in the official app, such as Stairs or Impulse, but these are not customisable. In my version you can set there:
  - from-to how much the strength is
  - how long the pattern should run for
  - how long an interval should be, i.e. a strength (in ms)

### Alarm Clock (not yet available)

- Alarm clock function with setting options?

### Shake Phone (Not yet available)

- Only available on the mobile phone, and will scan how much the mobile phone moves.
- A pattern or strength will be sent to the toy accordingly

### Save Options (Not yet available)

- General customising, if I ever have a database in the background (currently not yet the case)

### Idle Game??? (Not yet available)

- Maybe a game where you have to play the patterns or something. Not sure yet

### Settings

- Setting the IP and port

### Help (Not yet available)

- Info like here

## Roadmap?!

I don't have a clear roadmap, I build what comes to my mind. But ideas are always welcome :).
Nevertheless, there are already some buttons and pages built in that don't have a function yet, these will probably come in the future. (So the roadmap is, so to speak, what is unfinished in the app).

Translated with DeepL.com (free version)

Over and Out
PlexDev :)
