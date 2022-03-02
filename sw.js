var GHPATH = '/slope-game';
var APP_PREFIX = 'sg_';
var VERSION = 'version_02';
var URLS = [    
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/TemplateData/UnityProgress.js`,
  `${GHPATH}/TemplateData/progressEmpty.Dark.png`,
  `${GHPATH}/TemplateData/progressFull.Dark.png`,
  `${GHPATH}/TemplateData/progressLogo.Dark.png`,
  `${GHPATH}/TemplateData/style.css`,
  `${GHPATH}/TemplateData/unityloader41.js`,
  `${GHPATH}/Build/slope.json`,
  `${GHPATH}/Build/slope_data.unityweb`,
  `${GHPATH}/Build/slope_framework.unityweb`,
  `${GHPATH}/Build/slope_memory.unityweb`,
  `${GHPATH}/Build/slope_wasmcode.unityweb`,
  `${GHPATH}/Build/slope_wasmframework.unityweb`
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {       
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})
