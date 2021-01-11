---
id: installation
title: Installation
---

You can install Vue Query with [NPM](https://npmjs.com),
[Yarn](https://yarnpkg.com), or a good ol' `<script>` via
[unpkg.com](https://unpkg.com).

### NPM

```bash
$ npm i vue-query
# or
$ yarn add vue-query
```

Vue Query is compatible with Vue v16.8+ and works with ReactDOM and Vue Native.

> Wanna give it a spin before you download? Try out the [simple](/docs/examples/simple) or [basic](/docs/examples/basic) examples!

### CDN

If you're not using a module bundler or package manager we also have a global ("UMD") build hosted on the [unpkg.com](https://unpkg.com) CDN. Simply add the following `<script>` tag to the bottom of your HTML file:

```html
<script src="https://unpkg.com/vue-query/dist/vue-query.production.min.js"></script>
```

Once you've added this you will have access to the `window.ReactQuery` object and its exports.

> This installation/usage requires the [Vue CDN script bundles](https://reactjs.org/docs/cdn-links.html) to be on the page as well.
