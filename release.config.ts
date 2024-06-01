export default {
  branches: [
    'main'
    // 'next',
    // 'next-major',
    // { name: 'beta', prerelease: true },
    // { name: 'alpha', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    'semantic-release-export-data',
    [
      '@semantic-release/npm',
      {
        npmPublish: false
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'package-lock.json']
      }
    ]
  ]
}
