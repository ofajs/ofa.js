# ofa.js SSR Example

This is a sample project demonstrating ofa.js isomorphic rendering (SSR) implemented with Express.js.

## Project Structure

```
test/ssr-case/node/
├── app.js              # Express.js application main file
├── contact.page.html   # Page component example
├── package.json        # Project dependencies configuration
├── pages/              # Page template directory
│   ├── home.html       # Home page template
│   ├── about.html      # About page template
│   ├── contact.html    # Contact page template
│   └── 404.html        # Error page template
├── static/             # Static file directory
│   └── app-config.js   # ofa.js application configuration
└── README.md           # This documentation file
```

## Features

- **Isomorphic Rendering**: Server-side rendering of initial page content for SEO and fast first-contentful paint
- **Client Handover**: Client loads CSR runtime engine for smooth user experience
- **Multi-page Support**: Supports multiple pages including /home, /about, /contact
- **Dynamic Routing**: Dynamically generates page content based on request path

## Usage

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
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

- Static file service is configured at the `/static` directory under port 3000
- `app-config.js` is now located in the `/static` directory and can be accessed via `/app-config.js`
