module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{ico,html,json,css,js}",
    "src/images/*.{jpg,png}" // ignoring the icons folder
  ],
  "swSrc": "public/sw-base.js",
  "swDest": "public/service-worker.js",
  "globIgnores": [
    "../workbox-cli-config.js",
    "help/**"
  ]
};
