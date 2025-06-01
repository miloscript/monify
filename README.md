# monify-vite-electron

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

### Data Storage

The application stores its data in the following locations:

- Development: `~/Library/Application Support/monify-vite-electron/data/state.json`

To view the current state file:

```bash
$ cat ~/Library/Application\ Support/monify-vite-electron/data/state.json
```
