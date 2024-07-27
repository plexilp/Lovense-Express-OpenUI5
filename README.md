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
