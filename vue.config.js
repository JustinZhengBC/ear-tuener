const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_theme.scss";
        `,
      },
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "/ear-tuener/" : "/",
  transpileDependencies: true,
});
