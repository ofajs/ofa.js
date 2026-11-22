# Production and Deployment

Projects developed with ofa.js can be deployed directly to a static server for use.

## Development Environment

You can develop using the official [ofa Studio](https://core.noneos.com/?redirect=studio), which provides one-click project creation and preview.

You can also set up your own static server:

* Use static server software such as Nginx or Apache
* Use Node.js's [http-server](https://www.npmjs.com/package/http-server) module
* Directly use the static server plugin of the editor to preview

## Production Environment

### Export Project

If you are using a project built with [ofa Studio](https://core.noneos.com/?redirect=studio), simply use the export function provided by the tool.

If it is a manually built project, you can directly deploy the project folder to a static server, keeping the same pattern as the development environment.

### Compression and Obfuscation

Production environments typically require the use of compression and obfuscation tools to reduce file size and improve loading speed. You can use [Terser CLI](https://terser.org/docs/cli-usage/) for compression and obfuscation.

If you prefer not to use the command-line tool, you can use [ofa build](https://builder.ofajs.com/) to compress and obfuscate files online. The tool is currently in beta and will be integrated into ofa Studio later.

