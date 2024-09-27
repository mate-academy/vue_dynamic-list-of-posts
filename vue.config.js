const { defineConfig } = require('@vue/cli-service');
const { DefinePlugin } = require('webpack');

module.exports = {
  publicPath: '/vue_dynamic-list-of-posts/',
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.plugin('define').tap((args) => {
      args[0].__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
      return args;
    });
  },
};