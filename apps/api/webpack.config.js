const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      compiler: 'tsc',
      generatePackageJson: true,
      main: './src/main.ts',
      optimization: false,
      outputHashing: 'none',
      target: 'node',
      transformers: [
        {
          name: '@nestjs/swagger/plugin',
          options: {
            dtoFileNameSuffix: ['.dto.ts'],
          },
        },
      ],
      tsConfig: './tsconfig.app.json',
    }),
  ],
};
