module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'E-shop WCM',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover' },
      { name: 'theme-color', content: '#282828' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:title', content: 'E-shop Web Content Miner' },
      { property: 'og:description', name: 'description', content: 'Dolování dat z eshopů.' },
      { property: 'og:url', content: 'localhost:3000' }, //TODO změnit po nasazení na produkci
      { property: 'og:site_name', content: 'E-shop Web Content Miner' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'cs_CZ' },
      { name: 'msapplication-TileColor', content: '#2b5797' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    "~assets/styles/grid/resets.scss",
    "~assets/styles/grid/utils.scss",
    "skar-is/assets/scss/components/menu.scss",
    "skar-is/assets/scss/components/texts.scss",
    "skar-is/assets/scss/components/forms.scss",
    "skar-is/assets/scss/components/card.scss",
    "skar-is/assets/scss/components/media.scss"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~plugins/grid.js"
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: ["~assets/styles/grid/settings.scss", "~assets/styles/grid/functions.scss", "~assets/styles/grid/mixins.scss"]
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
};
