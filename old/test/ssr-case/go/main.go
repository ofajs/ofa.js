package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func getPageContent(baseDir, pathname string) string {
	pageMap := map[string]string{
		"/":        "/home",
		"/home":    "/home",
		"/about":   "/about",
		"/contact": "/contact",
	}

	normalizedPath := pathname
	if mappedPath, ok := pageMap[pathname]; ok {
		normalizedPath = mappedPath
	}

	var pageFilePath string

	switch normalizedPath {
	case "/home":
		pageFilePath = filepath.Join(baseDir, "pages", "home.html")
	case "/about":
		pageFilePath = filepath.Join(baseDir, "pages", "about.html")
	case "/contact":
		pageFilePath = filepath.Join(baseDir, "pages", "contact.html")
	default:
		pageFilePath = filepath.Join(baseDir, "pages", "404.html")
	}

	if fileExists(pageFilePath) {
		content, err := ioutil.ReadFile(pageFilePath)
		if err != nil {
			fmt.Printf("Error reading page file: %v\n", err)
			return getDefault404(baseDir)
		}
		return string(content)
	}

	return getDefault404(baseDir)
}

func getDefault404(baseDir string) string {
	default404Path := filepath.Join(baseDir, "pages", "404.html")
	if fileExists(default404Path) {
		content, _ := ioutil.ReadFile(default404Path)
		return string(content)
	}
	return `<template page><h1>Page Not Found</h1><p>The requested page could not be found.</p></template>`
}

func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	return err == nil && !info.IsDir()
}

func generateHTML(baseDir, pagePath string) string {
	pageContent := getPageContent(baseDir, pagePath)

	html := fmt.Sprintf(`<!doctype html>
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
      height: %s;
      padding: 0;
      margin: 0;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }

    o-app {
      height: %s;
    }
  </style>
</head>
<body>
  <o-app src="/app-config.js">
    %s
  </o-app>
</body>
</html>`, "100%", "100%", pageContent)

	return html
}

func handler(w http.ResponseWriter, r *http.Request) {
	baseDir := "."

	requestPath := r.URL.Path
	requestPath = strings.TrimRight(requestPath, "/")
	if requestPath == "" {
		requestPath = "/"
	}

	pagePath := requestPath
	if pagePath == "/" {
		pagePath = "/home"
	}

	html := generateHTML(baseDir, pagePath)

	w.Header().Set("Content-Type", "text/html; charset=UTF-8")
	fmt.Fprint(w, html)
}

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/app-config.js", fs)

	http.HandleFunc("/", handler)

	fmt.Println("Server is running on http://localhost:3000")
	fmt.Println("SSR demo with ofa.js is ready!")
	
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		fmt.Printf("Server error: %v\n", err)
	}
}
