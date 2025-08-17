# Basil's Portfolio

A modern portfolio website built with Next.js, TypeScript, and Tailwind CSS with dark mode support.

## Optimized for Performance

This project has been optimized for faster development and build times:

- Uses SWC instead of Babel for faster transpilation
- Optimized bundle size with selective imports
- Development mode optimizations for faster refresh
- Turbo mode available for even faster development

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
# Standard development server
npm run dev

# Fast development server (disables ESLint and TypeScript checking)
npm run dev:fast

# Turbo mode (experimental, even faster)
npm run dev:turbo
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

```bash
npm run build
# or
yarn build
```

To analyze the bundle size:

```bash
npm run build:analyze
# or
yarn build:analyze
```

## Performance Tips

- Keep Node.js updated to the latest LTS version
- Close resource-intensive applications when developing
- Use an SSD for development
- Consider increasing the RAM allocated to Node.js with `NODE_OPTIONS=--max_old_space_size=4096`

## Troubleshooting

If you get an error about port 3000 being in use, you can kill the process using:

```bash
npm run kill-port
```

Then try running the development server again.