const { version } = require('./package.json')

if (process.env.VITE_APP_VERSION === undefined) {
  process.env.VITE_APP_VERSION = version
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'app.monify.www',
  productName: 'Monify',
  directories: {
    output: 'dist',
    buildResources: 'build'
  },
  // extraResources: ['build/icons/**'],
  // files: ['packages/**/dist/**'],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION
  },
  mac: {
    icon: 'assets/icons/icon.icns',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    // entitlementsInherit: 'buildResources/entitlements.mac.inherit.plist',
    category: 'public.app-category.utilities',
    target: ['dmg'],
    publish: 'github'
  },
  // linux: {
  // icon: 'assets/icons/icon.icns',
  // category: 'Utility',
  //   target: ['deb', 'AppImage'],
  //   publish: 'github',
  //   desktop: {
  //     Icon: 'deskaide',
  //     MimeType: 'x-scheme-handler/deskaide;'
  //   }
  // },
  // win: {
  //   icon: 'assets/icons/Deskaide.ico',
  //   target: [
  //     {
  //       target: 'nsis',
  //       arch: ['x64']
  //     },
  //     {
  //       target: 'portable',
  //       arch: ['x64']
  //     }
  //   ],
  //   publish: 'github'
  // },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: false,
    differentialPackage: false
  },
  portable: {
    artifactName: '${productName}Portable.${ext}'
  },
  dmg: {
    sign: false
  }
  // afterSign: 'scripts/notarize.js'
}

module.exports = config
