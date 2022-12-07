module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{ico,html,json,css}",
    "src/images/*.{jpg,png}", // ignoring the icons folder
    "src/js/*.min.js"
  ],
  "swSrc": "public/sw-base.js",
  "swDest": "public/service-worker.js",
  "globIgnores": [
    "../workbox-cli-config.js",
    "help/**",
    "404.html"
  ]
};
