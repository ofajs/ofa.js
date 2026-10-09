# ofa.js SSR Example (PHP Version)

This is a sample project demonstrating ofa.js isomorphic rendering (SSR) implemented in PHP.

## Project Structure

```
test/ssr-case/php/
├── index.php             # PHP application main file
├── contact.page.html     # Page component example
├── pages/                # Page template directory
│   ├── home.html         # Home page template
│   ├── about.html        # About page template
│   ├── contact.html     # Contact page template
│   └── 404.html         # Error page template
├── static/               # Static file directory
│   └── app-config.js    # ofa.js application configuration
└── README.md            # This documentation file
```

## Features

- **Isomorphic Rendering**: Server-side rendering of initial page content for SEO and fast first-contentful paint
- **Client Handover**: Client loads CSR runtime engine for smooth user experience
- **Multi-page Support**: Supports multiple pages including /home, /about, /contact
- **Dynamic Routing**: Dynamically generates page content based on request path

## Usage

1. Ensure PHP is installed (recommended PHP 7.4+)

2. Start the PHP built-in server:
```bash
php -S localhost:8080
```

3. Access the application:
- Home: http://localhost:8080
- About: http://localhost:8080/about
- Contact: http://localhost:8080/contact

## Technical Implementation

This example demonstrates ofa.js's isomorphic rendering (Symphony Client-Server Rendering) pattern:

1. Server generates complete HTML pages with universal runtime structure
2. Client loads CSR runtime engine
3. Automatically detects current runtime environment to determine rendering strategy

Refer to [ofa.js SSR Documentation](../../../../tutorial/en/documentation/ssr.md) to learn more about isomorphic rendering.

## Static Resources Configuration

- The `static` directory needs to be configured as the static file directory
- `app-config.js` needs to be accessed via `/app-config.js`

## Nginx Configuration Example

If using Nginx as the web server, you can refer to the following configuration:

```nginx
server {
    listen 80;
    server_name localhost;
    root /path/to/test/ssr-case/php;
    index index.php index.html;

    # Static file directory
    location /app-config.js {
        alias /path/to/test/ssr-case/php/static/app-config.js;
    }

    # PHP processing
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # All other requests are handled by index.php
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
```
