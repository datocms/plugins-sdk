module.exports = ({ env }) => ({
  plugins: [
    env === 'prebuild' && require('postcss-modules')(),
    require('postcss-nested'),
    env === 'production' && require('postcss-import'),
    env === 'production' &&
      require('cssnano')({
        preset: 'default',
      }),
  ],
});
