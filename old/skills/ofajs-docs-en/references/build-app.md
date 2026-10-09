# Production and Deployment

Projects developed with ofa.js can be used directly by deploying to a static server.

## Development Environment

You can use the official [ofa Studio](https://core.noneos.com/?redirect=studio) for development, which provides one-stop project creation and preview.

You can also set up your own static server:

* Use static server software like Nginx or Apache
* Use Node.js's [http-server](https://www.npmjs.com/package/http-server) module
* Use the editor's static server plugin directly for preview

## Production Environment

### Exporting Projects

If you are using a project built with [ofa Studio](https://core.noneos.com/?redirect=studio), you can use the tool's built-in export function directly.

For manually built projects, you can deploy the project folder directly to a static server, keeping the same pattern as the development environment.

### Minification and Obfuscation

Production environments typically need to use minification and obfuscation tools to reduce file size and improve loading speed. You can use [Terser CLI](https://terser.org/docs/cli-usage/) for minification and obfuscation.

If you don't want to use command-line tools, you can use [ofa build](https://builder.ofajs.com/) for online file minification and obfuscation. This tool is currently in beta and will be merged into ofa Studio later.
