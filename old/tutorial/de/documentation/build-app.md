# Produktion und Bereitstellung

Mit ofa.js entwickelte Projekte können direkt auf einem statischen Server bereitgestellt und verwendet werden.

## Entwicklungsumgebung

Sie können die offizielle [ofa Studio](https://core.noneos.com/?redirect=studio) für die Entwicklung verwenden, die eine One-Click-Projekterstellung und -Vorschau bietet.

Sie können auch einen statischen Server selbst aufbauen:

* Verwenden Sie statische Serversoftware wie Nginx oder Apache
* Verwenden Sie das Modul [http-server](https://www.npmjs.com/package/http-server) von Node.js
* Verwenden Sie direkt das statische Server-Plugin des Editors zur Vorschau

## Produktionsumgebung

### Projekt exportieren

Wenn Sie ein mit [ofa Studio](https://core.noneos.com/?redirect=studio) erstelltes Projekt verwenden, nutzen Sie einfach die Exportfunktion des Tools.

Wenn es sich um ein manuell erstelltes Projekt handelt, kannst du den Projektordner direkt auf einem statischen Server bereitstellen und dabei die gleiche Konfiguration wie in der Entwicklungsumgebung beibehalten.

### Komprimierung und Verschleierung

In Produktionsumgebungen werden normalerweise Komprimierungs- und Verschleierungswerkzeuge benötigt, um die Dateigröße zu verringern und die Ladegeschwindigkeit zu verbessern. Sie können [Terser CLI](https://terser.org/docs/cli-usage/) zur Komprimierung und Verschleierung verwenden.

Wenn Sie kein Kommandozeilentool verwenden möchten, können Sie [ofa build](https://builder.ofajs.com/) online zur Dateikompression und -verschleierung nutzen. Dieses Tool befindet sich derzeit in der Testphase und wird später in ofa Studio integriert.

