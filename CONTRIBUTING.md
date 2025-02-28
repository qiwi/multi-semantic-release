# Contributing

Prerequisites:

- Node LTS
- Yarn Classic (`1.22.22`)
- Git

You can use `corepack` to install and set up Yarn Classic.

```sh
corepack enable
corepack prepare --activate
yarn # installs dependencies
```

## Note about Git configuration and tests

Automated tests create new Git repositories using `git init`.
If you have configured `init.templateDir`, this setting can break tests.

To check if you have set this setting, run this command.

```sh
git config --get --global init.templateDir
```

If the command outputs a path, you need to unset that config when you run tests.

```sh
git config --unset --global init.templateDir
```

To restore the config afterwards, run this command.

```sh
git config --add --global init.templateDir <value>
```
