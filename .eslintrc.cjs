const restrictedUiImports = [
  { name: 'antd', message: 'Active runtime UI must stay on Tailwind plus shared shadcn-style primitives.' },
  { name: '@ant-design/icons', message: 'Ant Design icons are archive-only, not approved for active runtime code.' },
  { name: '@mui/material', message: 'Material UI is not an approved active runtime UI foundation.' },
  { name: '@mui/icons-material', message: 'Material UI is not an approved active runtime UI foundation.' },
  { name: '@chakra-ui/react', message: 'Chakra UI is not an approved active runtime UI foundation.' },
  { name: '@mantine/core', message: 'Mantine is not an approved active runtime UI foundation.' },
  { name: '@mantine/hooks', message: 'Mantine is not an approved active runtime UI foundation.' },
]

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'archive/runtime-src-backups/**'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'off',
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', {
      varsIgnorePattern: '^(React|_)',
      argsIgnorePattern: '^_'
    }],
    'react/no-unescaped-entities': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.{js,jsx,ts,tsx}'],
      rules: {
        'no-restricted-imports': ['error', {
          paths: restrictedUiImports,
          patterns: [
            {
              group: ['antd/*', '@ant-design/*', '@mui/*', '@chakra-ui/*', '@mantine/*'],
              message: 'Active runtime UI must stay on Tailwind plus shared shadcn-style primitives.',
            },
            {
              group: ['archive/**', '../archive/**', '../../archive/**', '../../../archive/**', '../../../../archive/**'],
              message: 'Archive code is reference-only and must not be imported into active runtime source.',
            },
          ],
        }],
      },
    },
  ],
}
