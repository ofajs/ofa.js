# ofa.js SSR Example (Go Version)

This is a sample project demonstrating ofa.js isomorphic rendering (SSR) implemented in Go.

## Project Structure

```
test/ssr-case/go/
├── main.go              # Go application main file
├── contact.page.html    # Page component example
├── pages/               # Page template directory
│   ├── home.html        # Home page template
│   ├── about.html       # About page template
│   ├── contact.html     # Contact page template
│   └── 404.html        # Error page template
├── static/              # Static file directory
│   └── app-config.js   # ofa.js application configuration
└── README.md           # This documentation file
```

## Features

- **Isomorphic Rendering**: Server-side rendering of initial page content for SEO and fast first-contentful paint
- **Client Handover**: Client loads CSR runtime engine for smooth user experience
- **Multi-page Support**: Supports multiple pages including /home, /about, /contact
- **Dynamic Routing**: Dynamically generates page content based on request path

## Usage

1. Ensure Go is installed (recommended Go 1.16+)

2. Start the server:
```bash
cd /path/to/test/ssr-case/go
go run main.go
```

3. Access the application:
- Home: http://localhost:3000
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact

## Technical Implementation

This example demonstrates ofa.js's isomorphic rendering (Symphony Client-Server Rendering) pattern:

1. Server generates complete HTML pages with universal runtime structure
2. Client loads CSR runtime engine
3. Automatically detects current runtime environment to determine rendering strategy

Refer to [ofa.js SSR Documentation](../../../../tutorial/en/documentation/ssr.md) to learn more about isomorphic rendering.

## Static Resources Configuration

- Static file service is configured at `/app-config.js` path under port 3000
- `app-config.js` is located in the `static` directory and can be accessed via `/app-config.js`

## Build as Executable

You can build the project as a standalone executable:

```bash
go build -o ssr-demo main.go
./ssr-demo
```

## Nginx Configuration Example

If using Nginx as a reverse proxy, you can refer to the following configuration:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
