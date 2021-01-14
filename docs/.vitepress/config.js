const pkg = require('../../package.json')
const getSidebar = require('./utils/routes')

module.exports = {
  base: '/vu-query/',
  lang: 'en-US',
  title: pkg.name,
  description: pkg.description,

  themeConfig: {
    repo: 'liaoliao666/vu-query',
    docsDir: 'docs',

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    // nav: [
    //   { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
    //   {
    //     text: 'Config Reference',
    //     link: '/config/basics',
    //     activeMatch: '^/config/',
    //   },
    //   {
    //     text: 'Release Notes',
    //     link: 'https://github.com/vuejs/vitepress/releases',
    //   },
    // ],

    sidebar: getSidebar(),
  },
}
