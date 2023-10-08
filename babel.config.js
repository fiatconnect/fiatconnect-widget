module.exports = {
  presets: [
    [
      '@babel/preset-env',

      {
        exclude: ['transform-exponentiation-operator'],
      },
    ],
  ],
}
