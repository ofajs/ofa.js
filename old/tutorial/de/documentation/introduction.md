# Einführung

## Was ist ofa.js?

ofa.js ist ein benutzerfreundliches Web-Frontend-Framework, das speziell für die Entwicklung von Webanwendungen entwickelt wurde, um die Entwicklungseffizienz zu steigern und die Einstiegshürde zu senken.

> Wenn Sie mit HTML, CSS und JavaScript **bereits grundlegend vertraut** sind, dann ist ofa.js eine sehr gute Wahl.

## Warum ich ofa.js entwickelt habe

Das ursprüngliche Designziel von ofa.js ist einfach: ohne Kompilierungstools die **Engineering**-Probleme der Web-Entwicklung lösen.

> Engineering bezeichnet die systematische Integration von Standards, Prozessen, Tools und Methoden im Software-Entwicklungsprozess, um Effizienz, Codequalität und Wartbarkeit zu steigern.

In den letzten zehn Jahren hat die Web-Frontend-Entwicklung eine Entwicklung von anfänglichem wildem Wachstum zu allmählicher Engineerisierung durchgemacht. Dieser Prozess hat von den Erfahrungen der traditionellen Anwendungsentwicklung profitiert und durch die Einführung von Node.js und Kompilierungsprozessen die Engineerierungsprobleme großer Projekte gelöst.

Wenn das Projekt jedoch größer wird, zeigen sich allmählich die Nachteile dieses Modells, und es treten die Probleme traditioneller Entwicklung auf, nämlich das Problem der **monolithischen Anwendung**, was zu Schwierigkeiten bei der Wartung des Projekts und der Iteration der Interaktionsanforderungen führt.

> Monolithische Anwendung (Monolithic Application) bezeichnet eine große und eng gekoppelte Einzelanwendung, bei der alle Funktionsmodule in einer einzigen Codebasis konzentriert sind. Eine Änderung an einer Stelle wirkt sich auf das Ganze aus, und eine unabhängige Entwicklung und Bereitstellung ist schwierig.

In diesem Moment muss das Projekt zerlegt und in Mikro-Frontends umgewandelt werden, ähnlich wie bei **Microservices**. Durch die Kompilierung wird Micro-Frontend jedoch schwierig und umständlich; die eigenständige Bereitstellung von Frontend-Modulen erfordert die Kompilierung jedes einzelnen kleinen Moduls, was sehr schwierig ist und die Entwicklung von Web-Frontend-Technologien nahezu zum Stillstand bringt.

> Microservices sind ein Softwarearchitekturstil, der große, komplexe Anwendungen in mehrere feinkörnige, unabhängig bereitstellbare und laufende kleine Dienste aufteilt.

Zu diesem Zeitpunkt begann ich nachzudenken: Traditionelle Programmiersprachen müssen mit unterschiedlicher Hardware und Betriebssystemen umgehen, daher müssen sie durch Kompilierung plattformunabhängig gemacht werden. Aber die Webentwicklung ist anders – sie basiert auf Browsern, benötigt von Haus aus keine Kompilierung, kann unabhängig ausgeführt und bereitgestellt werden und ist von Natur aus ein Micro-Frontend-Modell. So wurde mir klar, dass es der Kompilierungsprozess ist, der die Dinge komplizierter macht.

Das bedeutet, dass sich die Frontend-Entwicklung dann gut für die Entwicklung großer Anwendungen eignet, wenn die Engineering-Probleme gelöst sind und der obligatorische Schritt der Kompilierung entfällt – das ist das natürliche Micro-Frontend-Muster. So entstand ofa.js.

## Kernvorteile

### Null Hürden, sofort einsatzbereit

Keine Einrichtung der Entwicklungsumgebung, Installation von Abhängigkeiten oder Konfiguration von Gerüsten erforderlich. Öffnen Sie das offizielle Build-Programm im Browser, wählen Sie ein lokales Verzeichnis aus und beginnen Sie mit der Entwicklung. Alle Berechnungen, Daten- und Speichervorgänge werden lokal ausgeführt, ohne Abhängigkeit von Cloud-Diensten.

### KI-freundlich, leicht zu verifizieren

Keine Black-Box-Kompilierung; der von der KI erzeugte Code kann schnell bereitgestellt und selbst validiert werden. Durch die Reduzierung von Zwischenschichten und das Umgehen des Kompilierungsprozesses wird die Fehlerlokalisierung und -behebung erleichtert.

### Native Unterstützung für Mikro-Frontends

ofa.js ermöglicht es, Web-Front-End-Entwicklung wie Microservices in viele unabhängige Module aufzuspalten, die jeweils separat entwickelt und deployed werden können. Sobald die Grenzen klassischer Web-Front-Ends durchbrochen sind, wird Front-End-Technologie schrittweise die Beschränkungen von Servertechnologien überwinden.

## Erste Schritte

- Wenn Sie über grundlegende Entwicklungskenntnisse verfügen, können Sie mit [Skripteinführung](./script-reference.md) beginnen.
- Wenn Sie Anfänger sind, wird empfohlen, mit [Erstellen der ersten App](./create-first-app.md) zu beginnen.