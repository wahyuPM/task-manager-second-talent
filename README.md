This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Table of Contents

- [Getting Started](#getting-started)
- [Development Tools](#development-tools)
  - [Husky](#husky)
  - [Commitizen](#commitizen)
  - [Commitlint](#commitlint)
  - [Tailwind CSS](#tailwind-css)
- [Internationalization](#internationalization)
- [Folder-level Documentation](#folder-level-documentation)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Development Tools

### Husky

[Husky](https://github.com/typicode/husky#readme) is installed to manage Git hooks. It helps enforce code quality and commit standards automatically.

- Pre-commit hooks: Run linters or tests before committing.
- Pre-push hooks: Run checks before pushing to remote.

- Usege :

Hooks are triggered automatically. To add or modify hooks, see the .husky/ directory.

### Commitizen

[Commitizen](https://github.com/commitizen/cz-cli#readme) is used to standardize commit messages.

- How to use:

```
npx cz
# or
npm run commit
```

### Commitlint

[Commitlint](https://github.com/conventional-changelog/commitlint#readme) checks that your commit messages meet the conventional commit format.

- How it works:

  Commitlint is integrated with Husky and runs automatically on commit. If your message does not follow the rules, the commit will be rejected.

### Tailwind CSS

This Project uses [Tailwind CSS v4](https://tailwindcss.com/) for styling.

Documentation:

Refer to the [Tailwind CSS documentation](https://tailwindcss.com/docs) for more information on how to use Tailwind CSS.

## Internationalization

This project uses next-intl for internationalization (i18n).

- How to use:

  Refer to the next-intl [documentation](https://github.com/amannn/next-intl) for adding and managing translations.

## Folder-level Documentation

Some folders in this project contain their own [README.md] files.
These provide specific documentation and usage instructions for the code or components within those folders.

- How to use:

  Look for a [README.md] inside a folder to understand its purpose, usage, and any special instructions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
