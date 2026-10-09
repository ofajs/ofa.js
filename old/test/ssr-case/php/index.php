<?php

$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = rtrim($path, '/');
if (empty($path)) {
    $path = '/';
}

$pagePath = ($path === '/') ? '/home' : $path;

function getPageContent($pathname) {
    $pageMap = [
        '/' => '/home',
        '/home' => '/home',
        '/about' => '/about',
        '/contact' => '/contact',
    ];

    $normalizedPath = $pageMap[$pathname] ?? $pathname;

    $baseDir = __DIR__;
    $pageFilePath = '';

    switch ($normalizedPath) {
        case '/home':
            $pageFilePath = $baseDir . '/pages/home.html';
            break;
        case '/about':
            $pageFilePath = $baseDir . '/pages/about.html';
            break;
        case '/contact':
            $pageFilePath = $baseDir . '/pages/contact.html';
            break;
        default:
            $pageFilePath = $baseDir . '/pages/404.html';
            break;
    }

    if (file_exists($pageFilePath)) {
        return file_get_contents($pageFilePath);
    } else {
        $default404Path = $baseDir . '/pages/404.html';
        if (file_exists($default404Path)) {
            return file_get_contents($default404Path);
        }
        return '<template page><h1>Page Not Found</h1><p>The requested page could not be found.</p></template>';
    }
}

$pageContent = getPageContent($pagePath);

$html = '<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ofa.js SSR Demo</title>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/dist/ofa.mjs#debug" type="module"></script>
  <script src="https://cdn.jsdelivr.net/gh/ofajs/ofa.js/libs/scsr/dist/scsr.min.mjs" type="module"></script>
  <style>
    html,
    body {
      height: 100%;
      padding: 0;
      margin: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }

    o-app {
      height: 100%;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    ' . $pageContent . '
  </o-app>
</body>
</html>';

header('Content-Type: text/html; charset=UTF-8');
echo $html;
