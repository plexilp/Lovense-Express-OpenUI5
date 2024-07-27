How to Start:

1. Node Modules installieren
2. Ins Root verzeichnis gehen und npm run install ausführen.
   (Sollte das nicht klappen, in den Ordner "backend" und "de.plexdev.lovapp" und jeweils npm i eingeben)
3. Im Root Verzeichnis: npm run build
4. Im Root Verzeichnis: npm run start
5. Im Browser http:// localhost oder IP :8081/ eingeben. (http://127.0.0.1:8081/)

Optional ab 3. (Work in Progress)

- Wenn https verwendet werden soll, in server.js den Wert bHttps auf true setzen
- Folgende Commands ausführen (in Windows z.B. mit der Git Bash)
  - openssl genrsa -out private.key 2048
  - openssl req -new -key private.key -out cert.csr
  - openssl x509 -req -in cert.csr -signkey private.key -out certificate.crt
- Dann natürlich https:// localhost oder IP :8081 öffnen

Und viel Spaß :)
