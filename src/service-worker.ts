/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

// https://create-react-app.dev/docs/making-a-progressive-web-app/#customization
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ignored = self.__WB_MANIFEST

registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.pathname.endsWith('.onnx'),
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new CacheFirst({
    cacheName: 'models',
    plugins: [new ExpirationPlugin()],
  }),
)

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.info('SKIP_WAITING')
    self.skipWaiting()
  }
})
