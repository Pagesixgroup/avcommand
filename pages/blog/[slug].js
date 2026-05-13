16:32:11.369 Running build in Washington, D.C., USA (East) – iad1
16:32:11.370 Build machine configuration: 2 cores, 8 GB
16:32:11.485 Cloning github.com/Pagesixgroup/avcommand (Branch: main, Commit: ba18b64)
16:32:11.792 Cloning completed: 307.000ms
16:32:12.394 Restored build cache from previous deployment (ADia9TK6eatyGXK1YrvSsXYSiiWp)
16:32:12.826 Running "vercel build"
16:32:12.845 Vercel CLI 53.3.2
16:32:13.050 Installing dependencies...
16:32:16.156 
16:32:16.157 up to date in 3s
16:32:16.158 
16:32:16.158 6 packages are looking for funding
16:32:16.159   run `npm fund` for details
16:32:16.185 Detected Next.js version: 15.3.6
16:32:16.189 Running "npm run build"
16:32:16.291 
16:32:16.292 > avcommand@1.0.0 build
16:32:16.292 > next build
16:32:16.292 
16:32:17.328    ▲ Next.js 15.3.6
16:32:17.329 
16:32:17.336    Linting and checking validity of types ...
16:32:17.442    Creating an optimized production build ...
16:32:20.943  ✓ Compiled successfully in 0ms
16:32:20.944    Collecting page data ...
16:32:22.037    Generating static pages (0/16) ...
16:32:22.677 ReferenceError: Cannot access 'a' before initialization
16:32:22.677     at <unknown> (.next/server/pages/blog/[slug].js:1:4469)
16:32:22.677     at Array.map (<anonymous>)
16:32:22.677     at <unknown> (.next/server/pages/blog/[slug].js:1:4263)
16:32:22.678     at c (.next/server/pages/blog/[slug].js:1:5416)
16:32:22.678 Error occurred prerendering page "/blog/crestron-simpl-plus-serial-control". Read more: https://nextjs.org/docs/messages/prerender-error
16:32:22.678 ReferenceError: Cannot access 'a' before initialization
16:32:22.678     at /vercel/path0/.next/server/pages/blog/[slug].js:1:4469
16:32:22.678     at Array.map (<anonymous>)
16:32:22.678     at /vercel/path0/.next/server/pages/blog/[slug].js:1:4263
16:32:22.679     at c (/vercel/path0/.next/server/pages/blog/[slug].js:1:5416)
16:32:22.679     at Wc (/vercel/path0/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:68:44)
16:32:22.679     at Zc (/vercel/path0/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:70:253)
16:32:22.679     at Z (/vercel/path0/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:76:89)
16:32:22.679     at $c (/vercel/path0/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:78:98)
16:32:22.680     at bd (/vercel/path0/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:77:404)
16:32:22.680     at Z (/vercel/path0/node_modules/react-dom/cjs/react-dom-server.browser.production.min.js:76:217)
16:32:22.680 Export encountered an error on /blog/[slug]: /blog/crestron-simpl-plus-serial-control, exiting the build.
16:32:22.699  ⨯ Next.js build worker exited with code: 1 and signal: null
16:32:22.730 Error: Command "npm run build" exited with 1
