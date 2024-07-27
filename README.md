## Willkommen
Diese App ist für die besonderen Spielzeuge von der Firma "Lovense". 
Für diese Spielzeuge gibt es eine offizielle Handy App und PC App, diese bieten auch viele Möglichkeiten, jedoch möchte so mancher sein Vergnügen genauer steuern können, dafür gibts nun unteranderem meine App.


Derzeit ist der Start noch etwas schwerer, wenn man nicht so viel mit Programmieren zu tun hat, das wird sich aber im Laufe der Updates verbessern. :)
How to Start:

1. Node Modules installieren
2. Ins Root verzeichnis gehen und npm run install ausführen.
   (Sollte das nicht klappen, in den Ordner "backend" und "de.plexdev.lovapp" und jeweils npm i eingeben)
3. Im Root Verzeichnis: npm run build
4. Im Root Verzeichnis: npm run start
5. Im Browser http:// localhost oder IP :8081/ eingeben. (http://127.0.0.1:8081/)
6. In der Lovense App (Apple, Android oder Windows) den Spiele Modus aktivieren
7. Im Tab "Settings" der Webseite die IP und den Port eingeben und speichern. (alternativ in der config.json ändern)

Optional ab 3. (Work in Progress)

- Wenn https verwendet werden soll, in config.json den Wert use-https auf true setzen
- Folgende Commands ausführen (in Windows z.B. mit der Git Bash)
  - openssl genrsa -out private.key 2048
  - openssl req -new -key private.key -out cert.csr
  - openssl x509 -req -in cert.csr -signkey private.key -out certificate.crt
- Dann natürlich https:// localhost oder IP :8081 öffnen

Und viel Spaß :)
