module.exports = {
  lang: 'en-US',
  title: 'Enrout API 🎉',
  description: 'An ultimate and awesome nodejs boilerplate wrote in typescript',
  base: process.env.DEPLOY_ENV === 'gh-pages' ? '/enrout/' : '/',
  themeConfig: {
    sidebar: [
      ['/', 'Introduction'],
      '/docs/development',
      '/docs/architecture',
      '/docs/naming-cheatsheet',
      '/docs/linting',
    ],
  },
};
