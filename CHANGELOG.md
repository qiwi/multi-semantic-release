## [6.5.1](https://github.com/qiwi/multi-semantic-release/compare/v6.5.0...v6.5.1) (2022-06-14)


### Bug Fixes

* ensure msr cli flags take precedence over their semrel equivalents ([2be75fa](https://github.com/qiwi/multi-semantic-release/commit/2be75fa0e38169f2c8233bbef0891e2e00f9fdb0))

# [6.5.0](https://github.com/qiwi/multi-semantic-release/compare/v6.4.0...v6.5.0) (2022-06-13)


### Features

* added declarative config support ([c98ff10](https://github.com/qiwi/multi-semantic-release/commit/c98ff10a5f6993d9bdc46a51a5077525b93e127e))

# [6.4.0](https://github.com/qiwi/multi-semantic-release/compare/v6.3.0...v6.4.0) (2022-05-24)


### Features

* support `${version}+${name}` tag format ([c53fefb](https://github.com/qiwi/multi-semantic-release/commit/c53fefb6e7ae8b3d16dbc235320c4f99d6ed4afc)), closes [#71](https://github.com/qiwi/multi-semantic-release/issues/71)
* support `release.config.cjs` ([a6b9370](https://github.com/qiwi/multi-semantic-release/commit/a6b93706964fc5c60986392c21404ccdef4ad01b))

# [6.3.0](https://github.com/qiwi/multi-semantic-release/compare/v6.2.0...v6.3.0) (2022-05-11)


### Features

* introduce `deps.prefix` flag to inject carets ([c3f4529](https://github.com/qiwi/multi-semantic-release/commit/c3f452976ac6642f8a285f2e9faa6521a5bba919))

# [6.2.0](https://github.com/qiwi/multi-semantic-release/compare/v6.1.1...v6.2.0) (2022-05-08)


### Features

* prefer nested CLI flags ([1bf08cc](https://github.com/qiwi/multi-semantic-release/commit/1bf08ccbc722858febcaaaac2f8e0ba72638460c))

## [6.1.1](https://github.com/qiwi/multi-semantic-release/compare/v6.1.0...v6.1.1) (2022-04-09)


### Bug Fixes

* dont fetch tags if tags arg is empty array ([3a79558](https://github.com/qiwi/multi-semantic-release/commit/3a7955861d7782dd2257661d955a2adbf319627f))
* print queued pkg count instead of total ([d893a7f](https://github.com/qiwi/multi-semantic-release/commit/d893a7ff9f6f4d85377a1b61144842f3d07657a7))

# [6.1.0](https://github.com/qiwi/multi-semantic-release/compare/v6.0.2...v6.1.0) (2022-03-31)


### Features

* introduce `ignorePrivate` flag ([e4891c9](https://github.com/qiwi/multi-semantic-release/commit/e4891c9f754afcc7fe87e84c390560a3fc5feef8)), closes [#66](https://github.com/qiwi/multi-semantic-release/issues/66)

## [6.0.2](https://github.com/qiwi/multi-semantic-release/compare/v6.0.1...v6.0.2) (2022-03-07)


### Bug Fixes

* rm npm from peer deps ([307e505](https://github.com/qiwi/multi-semantic-release/commit/307e5057f12a9f616bdb432db2708e5193c34d4f))

## [6.0.1](https://github.com/qiwi/multi-semantic-release/compare/v6.0.0...v6.0.1) (2022-03-06)


### Bug Fixes

* fix export point ([cf31425](https://github.com/qiwi/multi-semantic-release/commit/cf314259697d8c7492c3c63da380b4207aae665a))

# [6.0.0](https://github.com/qiwi/multi-semantic-release/compare/v5.0.3...v6.0.0) (2022-03-06)


### Bug Fixes

* up deps, fix some vuls ([2d5cf86](https://github.com/qiwi/multi-semantic-release/commit/2d5cf8660c0ebb2f97fa7476df1cd4fed63d07d1))


### Code Refactoring

* move to ESM ([99fffa9](https://github.com/qiwi/multi-semantic-release/commit/99fffa9c82b21a1578d376ac206e46d32e6b7ae3))


### Features

* replace synchronizer with @semrel-extra/topo ([ddd1032](https://github.com/qiwi/multi-semantic-release/commit/ddd10320487f5367aff15dd36c03c5bd60046b16))


### BREAKING CHANGES

* drop support for cycled monorepos
* require Node.js v12

## [5.0.3](https://github.com/qiwi/multi-semantic-release/compare/v5.0.2...v5.0.3) (2022-03-05)


### Bug Fixes

* fix nextType resolver ([606914b](https://github.com/qiwi/multi-semantic-release/commit/606914b43fc657340e243ca86430a7fff799210b))

## [5.0.2](https://github.com/qiwi/multi-semantic-release/compare/v5.0.1...v5.0.2) (2022-03-05)


### Bug Fixes

* add sync point for publish step ([adc823e](https://github.com/qiwi/multi-semantic-release/commit/adc823e1c4d2a952c58c8cf2f4fc00db7325ec53))

## [5.0.1](https://github.com/qiwi/multi-semantic-release/compare/v5.0.0...v5.0.1) (2022-03-05)


### Bug Fixes

* fix cascade bumping when some dep belongs to several levels of the dep tree ([cf20dea](https://github.com/qiwi/multi-semantic-release/commit/cf20deac25982d98fe795c507253ef389c0ecb81))

# [5.0.0](https://github.com/qiwi/multi-semantic-release/compare/v4.0.3...v5.0.0) (2022-03-04)


### Features

* enable `sequentialPrepare` flag by default ([ad7e81f](https://github.com/qiwi/multi-semantic-release/commit/ad7e81f2e30b7673444dc31f39381b20afdf54bc))


### BREAKING CHANGES

* sequentialPrepare is set to true, to disable pass `--no-sequential-prepare` option

## [4.0.3](https://github.com/qiwi/multi-semantic-release/compare/v4.0.2...v4.0.3) (2022-03-01)


### Bug Fixes

* update manifest version before npm plugin prepare step ([a1ae4c3](https://github.com/qiwi/multi-semantic-release/commit/a1ae4c3785498a3b22afcac278e431aaf99a1232)), closes [#58](https://github.com/qiwi/multi-semantic-release/issues/58)

## [4.0.2](https://github.com/qiwi/multi-semantic-release/compare/v4.0.1...v4.0.2) (2022-02-22)


### Bug Fixes

* pin npm as peer dep ([67d8b80](https://github.com/qiwi/multi-semantic-release/commit/67d8b8095018b5d979795703f36d874a174baf07))

## [4.0.1](https://github.com/qiwi/multi-semantic-release/compare/v4.0.0...v4.0.1) (2022-02-22)


### Bug Fixes

* pin npm version to v8.4.1 ([22c89d1](https://github.com/qiwi/multi-semantic-release/commit/22c89d164ca6e4fb8fe5e9b7e3164685d543d5bd)), closes [#60](https://github.com/qiwi/multi-semantic-release/issues/60)

# [4.0.0](https://github.com/qiwi/multi-semantic-release/compare/v3.17.1...v4.0.0) (2022-02-22)


### Features

* bump semrel to v19 ([e6b8acb](https://github.com/qiwi/multi-semantic-release/commit/e6b8acb937e43ef28f311922e84434c75c8ad844))


### BREAKING CHANGES

* semrel npm plugin calls local npm version https://github.com/semantic-release/npm/pull/445

## [3.17.1](https://github.com/qiwi/multi-semantic-release/compare/v3.17.0...v3.17.1) (2021-12-29)


### Bug Fixes

* fix globbing on Windows ([#57](https://github.com/qiwi/multi-semantic-release/issues/57)) ([1d71d21](https://github.com/qiwi/multi-semantic-release/commit/1d71d21bc0f95a921e390d59b80d0e2f4a3bd611))

# [3.17.0](https://github.com/qiwi/multi-semantic-release/compare/v3.16.0...v3.17.0) (2021-11-17)


### Features

* handle .cjs configs ([38f657a](https://github.com/qiwi/multi-semantic-release/commit/38f657aea29097f55e5eafe0bd3f82790eded7f1))

# [3.16.0](https://github.com/qiwi/multi-semantic-release/compare/v3.15.0...v3.16.0) (2021-09-10)


### Features

* add --tag-version-format flag ([259864c](https://github.com/qiwi/multi-semantic-release/commit/259864c2860b651435b4a8e1f01c3cfab350c590))

# [3.15.0](https://github.com/qiwi/multi-semantic-release/compare/v3.14.2...v3.15.0) (2021-07-08)


### Bug Fixes

* update deps, fix some vuls ([f3cafc8](https://github.com/qiwi/multi-semantic-release/commit/f3cafc812ad58fb03c87065b477860ff5e58023c))


### Features

* add pnpm and bolt support ([91465de](https://github.com/qiwi/multi-semantic-release/commit/91465de637524b109aa4f6b898ff0e451ef39c36))

## [3.14.2](https://github.com/qiwi/multi-semantic-release/compare/v3.14.1...v3.14.2) (2021-04-16)


### Bug Fixes

* **sequential-prepare:** do not wait forever when a child package has no change ([713046a](https://github.com/qiwi/multi-semantic-release/commit/713046a251e9da435dad99ce7d5c7745aeff1871))

## [3.14.1](https://github.com/qiwi/multi-semantic-release/compare/v3.14.0...v3.14.1) (2021-04-14)


### Bug Fixes

* add flag to enable sequentialPrepare mode ([70c2dc5](https://github.com/qiwi/multi-semantic-release/commit/70c2dc54b393a9f0b9d7fca82a1f83a22bd2ff54))

# [3.14.0](https://github.com/qiwi/multi-semantic-release/compare/v3.13.2...v3.14.0) (2021-04-13)


### Features

* allow to run prepare steps sequentially ([299748a](https://github.com/qiwi/multi-semantic-release/commit/299748adc7d6ca4f25db70557d90a124dd7d9f47))
* check that sequentialPrepare is not enabled on cyclic projects ([68c1198](https://github.com/qiwi/multi-semantic-release/commit/68c1198c395fb00c05fa97db66399f940575c9ee))

## [3.13.2](https://github.com/qiwi/multi-semantic-release/compare/v3.13.1...v3.13.2) (2021-02-09)


### Bug Fixes

* filter only tags that are valid ([59b61ad](https://github.com/qiwi/multi-semantic-release/commit/59b61ad1a5823c24d7ff4237edf821fffb04abff))
* getVersionFromTag tests to fix release process ([e7f1646](https://github.com/qiwi/multi-semantic-release/commit/e7f16466bccc39311da8017dd5f0f7a8ae57686d))

## [3.13.1](https://github.com/qiwi/multi-semantic-release/compare/v3.13.0...v3.13.1) (2021-02-05)


### Bug Fixes

* **package:** up deps, fix some vuls ([d8905b0](https://github.com/qiwi/multi-semantic-release/commit/d8905b09152972a30d906ac18fca686b65e61591))

# [3.13.0](https://github.com/qiwi/multi-semantic-release/compare/v3.12.6...v3.13.0) (2021-02-04)


### Features

* ignore packages to be released with workspaces and CLI ([#42](https://github.com/qiwi/multi-semantic-release/issues/42)) ([b98e181](https://github.com/qiwi/multi-semantic-release/commit/b98e181978294bbca7ae7f1a9ab7a9ecf0819847))

## [3.12.6](https://github.com/qiwi/multi-semantic-release/compare/v3.12.5...v3.12.6) (2021-02-01)


### Bug Fixes

* wrong context.commits when have multiple releases commit ([f82f125](https://github.com/qiwi/multi-semantic-release/commit/f82f1258255b7016c45405cc91e3056a1701e92d))

## [3.12.5](https://github.com/qiwi/multi-semantic-release/compare/v3.12.4...v3.12.5) (2021-01-22)


### Bug Fixes

* **update-deps:** properly resolve next pre-versions ([62b348e](https://github.com/qiwi/multi-semantic-release/commit/62b348eb87ccbccf21380ea0153036ef9792dcaa))

## [3.12.4](https://github.com/qiwi/multi-semantic-release/compare/v3.12.3...v3.12.4) (2021-01-22)


### Bug Fixes

* bump-up of pre-version  ([02ef270](https://github.com/qiwi/multi-semantic-release/commit/02ef270865c45e06bf8d2761359fd53b08cadb70))

## [3.12.3](https://github.com/qiwi/multi-semantic-release/compare/v3.12.2...v3.12.3) (2021-01-05)


### Performance Improvements

* refactor nextPreVersion to reduce cognitive complexity ([#35](https://github.com/qiwi/multi-semantic-release/issues/35)) ([601bbd3](https://github.com/qiwi/multi-semantic-release/commit/601bbd35d969167c5b54cb0e8bad2be0a2165705))

## [3.12.2](https://github.com/qiwi/multi-semantic-release/compare/v3.12.1...v3.12.2) (2021-01-05)


### Bug Fixes

* local dependencies correct bump from release to prerelease ([#34](https://github.com/qiwi/multi-semantic-release/issues/34)) ([6481a59](https://github.com/qiwi/multi-semantic-release/commit/6481a590e52224405793ea375fbd689120341a42))

## [3.12.1](https://github.com/qiwi/multi-semantic-release/compare/v3.12.0...v3.12.1) (2020-12-30)


### Bug Fixes

* avoid non-updated local dependencies bump ([#33](https://github.com/qiwi/multi-semantic-release/issues/33)) ([9faeef6](https://github.com/qiwi/multi-semantic-release/commit/9faeef65538535a5611730e016a3cbd3f454052b))

# [3.12.0](https://github.com/qiwi/multi-semantic-release/compare/v3.11.2...v3.12.0) (2020-12-30)


### Features

* **debug:** attach pkg prefixes to debug notes ([25e111f](https://github.com/qiwi/multi-semantic-release/commit/25e111f4b85e20c06d518abc1245918788f730a5))

## [3.11.2](https://github.com/qiwi/multi-semantic-release/compare/v3.11.1...v3.11.2) (2020-12-29)


### Bug Fixes

* **config:** fix `options` and `plugins` resolver ([56e974c](https://github.com/qiwi/multi-semantic-release/commit/56e974cec12f47d50f967d681506a84418b4e6bb))

## [3.11.1](https://github.com/qiwi/multi-semantic-release/compare/v3.11.0...v3.11.1) (2020-12-28)


### Bug Fixes

* fix pkgOptions resolver ([2a2f0cf](https://github.com/qiwi/multi-semantic-release/commit/2a2f0cf43888f2d6acfc174f12993948947f0111))

# [3.11.0](https://github.com/qiwi/multi-semantic-release/compare/v3.10.0...v3.11.0) (2020-12-24)


### Features

* **debug:** log manifest deps changes ([88b4077](https://github.com/qiwi/multi-semantic-release/commit/88b40770d2cdaaf30912745f4fc4eee44357d9ea)), closes [#27](https://github.com/qiwi/multi-semantic-release/issues/27)

# [3.10.0](https://github.com/qiwi/multi-semantic-release/compare/v3.9.5...v3.10.0) (2020-12-23)


### Features

* provide pre-release flow ([6a9ce16](https://github.com/qiwi/multi-semantic-release/commit/6a9ce165c44aba3b8ef787cdfa575ad8b0dc3f05)), closes [#25](https://github.com/qiwi/multi-semantic-release/issues/25)

## [3.9.5](https://github.com/qiwi/multi-semantic-release/compare/v3.9.4...v3.9.5) (2020-11-23)


### Bug Fixes

* fix getNextVersion resolver ([7275ae7](https://github.com/qiwi/multi-semantic-release/commit/7275ae75799ad3cb3bca34c9cfa2978fed092794))

## [3.9.4](https://github.com/qiwi/multi-semantic-release/compare/v3.9.3...v3.9.4) (2020-11-23)


### Bug Fixes

* apply deps update before npm's plugin prepare ([77b6ee2](https://github.com/qiwi/multi-semantic-release/commit/77b6ee2e8d1a281d359520fe12e548ea79776b5e))

## [3.9.3](https://github.com/qiwi/multi-semantic-release/compare/v3.9.2...v3.9.3) (2020-11-23)


### Bug Fixes

* trigger next pkg `prepare` after the prev `publish` ([f74d185](https://github.com/qiwi/multi-semantic-release/commit/f74d185c268567585393b977817ab69f3225532a))

## [3.9.2](https://github.com/qiwi/multi-semantic-release/compare/v3.9.1...v3.9.2) (2020-11-23)


### Performance Improvements

* up deps, minor code improvements ([a7aa625](https://github.com/qiwi/multi-semantic-release/commit/a7aa625f6325c5fd8cb1a0ca8e1029b5ea082950))

## [3.9.1](https://github.com/qiwi/multi-semantic-release/compare/v3.9.0...v3.9.1) (2020-11-21)


### Performance Improvements

* **package:** up deps ([506a0e8](https://github.com/qiwi/multi-semantic-release/commit/506a0e80d9152427eb8dca5c9032754fce4e8a22))

# [3.9.0](https://github.com/qiwi/multi-semantic-release/compare/v3.8.5...v3.9.0) (2020-11-21)


### Bug Fixes

* sync pkg version after running the npm plugin ([1d24e45](https://github.com/qiwi/multi-semantic-release/commit/1d24e45c7ebba1b6b97ef259e98ea17fbb5d9d35))


### Features

* add dependencies updating controller ([0c9b040](https://github.com/qiwi/multi-semantic-release/commit/0c9b0406c35cedb264ac321805da4e93b9f2d5d8))

## [3.8.5](https://github.com/qiwi/multi-semantic-release/compare/v3.8.4...v3.8.5) (2020-10-02)


### Bug Fixes

* specify used but forgotten dependencies ([73def7f](https://github.com/qiwi/multi-semantic-release/commit/73def7f4dcfccf12c9cf3a0d998889ea1cd53b10))

## [3.8.4](https://github.com/qiwi/multi-semantic-release/compare/v3.8.3...v3.8.4) (2020-09-23)


### Bug Fixes

* **package:** up deps, fix vulns ([5a4d91e](https://github.com/qiwi/multi-semantic-release/commit/5a4d91e879397acc0d8b08af6337817f66491739))

## [3.8.3](https://github.com/qiwi/multi-semantic-release/compare/v3.8.2...v3.8.3) (2020-08-04)


### Bug Fixes

* preserve trailing whitespace in manifest ([06426ec](https://github.com/qiwi/multi-semantic-release/commit/06426ec05f04cdcdf1561a4d1220890cf8ab1421))

## [3.8.2](https://github.com/qiwi/multi-semantic-release/compare/v3.8.1...v3.8.2) (2020-08-03)


### Bug Fixes

* process optional deps during manifest update ([4b7066c](https://github.com/qiwi/multi-semantic-release/commit/4b7066c9b78169638baed7f7faefbbcd3705f5a4))

## [3.8.1](https://github.com/qiwi/multi-semantic-release/compare/v3.8.0...v3.8.1) (2020-07-31)


### Bug Fixes

* fix internal flag ref filterParent → firstParent ([8c7400f](https://github.com/qiwi/multi-semantic-release/commit/8c7400fe2f639f5d7abfc9219efb1b331c585fc8))

# [3.8.0](https://github.com/qiwi/multi-semantic-release/compare/v3.7.0...v3.8.0) (2020-07-24)


### Features

* enable first-parent commits filtering by cli flag ([33306cc](https://github.com/qiwi/multi-semantic-release/commit/33306cce3e6e7d118a74690ecf3b33ac4154eac9))

# [3.7.0](https://github.com/qiwi/multi-semantic-release/compare/v3.6.0...v3.7.0) (2020-07-24)


### Features

* log filtered commits in debug ([c64b8e1](https://github.com/qiwi/multi-semantic-release/commit/c64b8e1a4e97b7164b80f267d631dbccb459a64d))

# [3.6.0](https://github.com/qiwi/multi-semantic-release/compare/v3.5.1...v3.6.0) (2020-07-21)


### Features

* add some debug messages ([ec792e1](https://github.com/qiwi/multi-semantic-release/commit/ec792e15a4223880054186035571f8ca647add0e))

## [3.5.1](https://github.com/qiwi/multi-semantic-release/compare/v3.5.0...v3.5.1) (2020-07-20)


### Performance Improvements

* various synchronizer optimizations ([87a7602](https://github.com/qiwi/multi-semantic-release/commit/87a760293fd97ab3aeaf361a256659897c96af9c))

# [3.5.0](https://github.com/qiwi/multi-semantic-release/compare/v3.4.0...v3.5.0) (2020-07-20)


### Features

* **debug:** print passed cli flags ([d720cd7](https://github.com/qiwi/multi-semantic-release/commit/d720cd717b2b99fa32a2d6a438a5142ebc453c26))

# [3.4.0](https://github.com/qiwi/multi-semantic-release/compare/v3.3.0...v3.4.0) (2020-07-19)


### Features

* add sequential-init flag to avoid hypothetical concurrent initialization collisions ([348678e](https://github.com/qiwi/multi-semantic-release/commit/348678ef1997ec914c0471bd60e47b987244ba54))

# [3.3.0](https://github.com/qiwi/multi-semantic-release/compare/v3.2.0...v3.3.0) (2020-07-17)


### Features

* support workspace.packages notation ([4a606b2](https://github.com/qiwi/multi-semantic-release/commit/4a606b2ceffcd70e18c015d51e62cda78f4cf58e))

# [3.2.0](https://github.com/qiwi/multi-semantic-release/compare/v3.1.0...v3.2.0) (2020-07-14)


### Features

* apply --first-parent filter to commits ([14a896b](https://github.com/qiwi/multi-semantic-release/commit/14a896b5e501e6c900b8d89ee16ff17289c1d3a1))

# [3.1.0](https://github.com/qiwi/multi-semantic-release/compare/v3.0.3...v3.1.0) (2020-07-07)


### Features

* uphold the prev package.json indents ([ac5832f](https://github.com/qiwi/multi-semantic-release/commit/ac5832f20c8218c95fc46719cbd532732db53419))

## [3.0.3](https://github.com/qiwi/multi-semantic-release/compare/v3.0.2...v3.0.3) (2020-06-26)


### Bug Fixes

* override env.TRAVIS_PULL_REQUEST_BRANCH to fix PR checks on travis-ci ([e4b1929](https://github.com/qiwi/multi-semantic-release/commit/e4b192971f3cba0ad8e341cdc64116285a9de220)), closes [#11](https://github.com/qiwi/multi-semantic-release/issues/11)

## [3.0.2](https://github.com/qiwi/multi-semantic-release/compare/v3.0.1...v3.0.2) (2020-06-16)


### Bug Fixes

* allow any `todo` package to run the `generateNotes` queue ([26a87d7](https://github.com/qiwi/multi-semantic-release/commit/26a87d7f88c09417b47b55fe6e21edb6d13f5520)), closes [#9](https://github.com/qiwi/multi-semantic-release/issues/9)

## [3.0.1](https://github.com/qiwi/multi-semantic-release/compare/v3.0.0...v3.0.1) (2020-06-05)


### Bug Fixes

* filter queued packages on generateNotes stage ([e0625ce](https://github.com/qiwi/multi-semantic-release/commit/e0625ced9c52d027246b58305d8206c949b4958c)), closes [#6](https://github.com/qiwi/multi-semantic-release/issues/6)

# [3.0.0](https://github.com/qiwi/multi-semantic-release/compare/v2.6.4...v3.0.0) (2020-06-04)


### Features

* **engine:** up nodejs version ([10af385](https://github.com/qiwi/multi-semantic-release/commit/10af3850de9cc04a1f4a85c505752b659e3f47ff))


### BREAKING CHANGES

* **engine:** the latest semantic-release requires Node.js 10.18

## [2.6.4](https://github.com/qiwi/multi-semantic-release/compare/v2.6.3...v2.6.4) (2020-05-28)


### Performance Improvements

* deps revision ([4f62817](https://github.com/qiwi/multi-semantic-release/commit/4f628175669ef025f91b2c2cdacafd37252a7f87))

## [2.6.3](https://github.com/qiwi/multi-semantic-release/compare/v2.6.2...v2.6.3) (2020-05-28)


### Performance Improvements

* straighten plugins execution pipeline ([e57fe2f](https://github.com/qiwi/multi-semantic-release/commit/e57fe2fc3274d66520fbeacdac488b1a29430835)), closes [#4](https://github.com/qiwi/multi-semantic-release/issues/4)

## [2.6.2](https://github.com/qiwi/multi-semantic-release/compare/v2.6.1...v2.6.2) (2020-05-22)


### Bug Fixes

* beautify log labels ([78cbc8a](https://github.com/qiwi/multi-semantic-release/commit/78cbc8a773076c370f43894d35423a0a23b0cafb))

## [2.6.1](https://github.com/qiwi/multi-semantic-release/compare/v2.6.0...v2.6.1) (2020-05-22)


### Bug Fixes

* provide partial release ([898998a](https://github.com/qiwi/multi-semantic-release/commit/898998a25f100e3450b14dd55ea6c468d3a02432))

# [2.6.0](https://github.com/qiwi/multi-semantic-release/compare/v2.5.0...v2.6.0) (2020-05-21)


### Features

* let publish step run in parallel ([4d5c451](https://github.com/qiwi/multi-semantic-release/commit/4d5c451e9400437820002a54a297a3c031856997))

# [2.5.0](https://github.com/qiwi/multi-semantic-release/compare/v2.4.3...v2.5.0) (2020-05-20)


### Bug Fixes

* publish updated deps ([791f55a](https://github.com/qiwi/multi-semantic-release/commit/791f55a34574f5e6531ed69f182ffd54b68e2450)), closes [#1](https://github.com/qiwi/multi-semantic-release/issues/1)


### Features

* add execa queued hook ([042933e](https://github.com/qiwi/multi-semantic-release/commit/042933eb619e3fb7111a8e1d4a41e3593e2729ca))
* apply queuefy to plugin methods instead of execa ([9ae7d0d](https://github.com/qiwi/multi-semantic-release/commit/9ae7d0d8c1cc9300517733fe9e4edcb557069dff))

## [2.4.3](https://github.com/qiwi/multi-semantic-release/compare/v2.4.2...v2.4.3) (2020-03-08)


### Performance Improvements

* log yarn paths ([3896d5c](https://github.com/qiwi/multi-semantic-release/commit/3896d5ca4e97870e37d2f254e3586cb5b9165b84))

## [2.4.2](https://github.com/qiwi/multi-semantic-release/compare/v2.4.1...v2.4.2) (2020-03-07)


### Bug Fixes

* make logger to be singleton ([1790794](https://github.com/qiwi/multi-semantic-release/commit/179079420368d4a33505adca3079c06eddad928d))

## [2.4.1](https://github.com/qiwi/multi-semantic-release/compare/v2.4.0...v2.4.1) (2020-03-07)


### Performance Improvements

* log improvements ([c45dccc](https://github.com/qiwi/multi-semantic-release/commit/c45dcccd3e81b9ce0489a920ce16f9616b4ebda0))

# [2.4.0](https://github.com/qiwi/multi-semantic-release/compare/v2.3.3...v2.4.0) (2020-03-07)


### Features

* log manifest path ([db451e8](https://github.com/qiwi/multi-semantic-release/commit/db451e877e53e54487019978ee20bd03c64fa992))

## [2.3.3](https://github.com/qiwi/multi-semantic-release/compare/v2.3.2...v2.3.3) (2020-03-07)


### Bug Fixes

* fix logger path ([232d2dc](https://github.com/qiwi/multi-semantic-release/commit/232d2dc62ce440bf58ff7d05df5d27f72f24cfe6))

## [2.3.2](https://github.com/qiwi/multi-semantic-release/compare/v2.3.1...v2.3.2) (2020-03-07)


### Performance Improvements

* log multi-sem-rel flags ([75389e0](https://github.com/qiwi/multi-semantic-release/commit/75389e06b97f39bfd3e5a797677ee835bc569557))

## [2.3.1](https://github.com/qiwi/multi-semantic-release/compare/v2.3.0...v2.3.1) (2020-03-07)


### Bug Fixes

* fix debug logging ([71527b2](https://github.com/qiwi/multi-semantic-release/commit/71527b2578a0a559ac1b175936d72e043258fe04))

# [2.3.0](https://github.com/qiwi/multi-semantic-release/compare/v2.2.0...v2.3.0) (2020-03-06)


### Features

* add debugger ([d2c090d](https://github.com/qiwi/multi-semantic-release/commit/d2c090daa104d19d71a09e54c7ff396d0f5824df))

# [2.2.0](https://github.com/qiwi/multi-semantic-release/compare/v2.1.3...v2.2.0) (2020-03-06)


### Features

* add meow as cli provider ([6de93b9](https://github.com/qiwi/multi-semantic-release/commit/6de93b9d7d5f818cccf5a376222e091d3be34065))

## [2.1.3](https://github.com/qiwi/multi-semantic-release/compare/v2.1.2...v2.1.3) (2020-03-05)


### Bug Fixes

* try to prevent deps update rollback ([9108350](https://github.com/qiwi/multi-semantic-release/commit/910835046bc6dc5e63d637d83276d945df6f1943))

## [2.1.2](https://github.com/qiwi/multi-semantic-release/compare/v2.1.1...v2.1.2) (2020-02-13)


### Bug Fixes

* **cli:** fix inner spawnhook call ([70aa292](https://github.com/qiwi/multi-semantic-release/commit/70aa2927cd52a374f1626ab514a836bc9d98edaa))

## [2.1.1](https://github.com/qiwi/multi-semantic-release/compare/v2.1.0...v2.1.1) (2020-02-13)


### Bug Fixes

* **cli:** restore watchspawn context ([56145aa](https://github.com/qiwi/multi-semantic-release/commit/56145aaae5b43065c9925ed661302216e649112f))

# [2.1.0](https://github.com/qiwi/multi-semantic-release/compare/v2.0.1...v2.1.0) (2020-02-13)


### Features

* add process.spawn arg watcher ([7699b6f](https://github.com/qiwi/multi-semantic-release/commit/7699b6f4058934cbcf51b196d7f6aaa13372b35a))

## [2.0.1](https://github.com/qiwi/multi-semantic-release/compare/v2.0.0...v2.0.1) (2020-02-11)


### Performance Improvements

* **package:** up deps ([6b903a7](https://github.com/qiwi/multi-semantic-release/commit/6b903a7e318326c53cbd9cfb201546d84e650c32))

# [2.0.0](https://github.com/qiwi/multi-semantic-release/compare/v1.2.0...v2.0.0) (2020-01-19)


### Features

* drop nodejs v8 support ([80f0a24](https://github.com/qiwi/multi-semantic-release/commit/80f0a242e195c6b4f7d6a68cdcbff9a25cd5577f))


### Performance Improvements

* **package:** up deps & tech release ([bf00b41](https://github.com/qiwi/multi-semantic-release/commit/bf00b41662805ba87d67865830c7b0d8d88e20b9))


### BREAKING CHANGES

* drop nodejs v8

# [1.2.0](https://github.com/qiwi/multi-semantic-release/compare/v1.1.0...v1.2.0) (2019-11-03)


### Features

* tech release ([828a82d](https://github.com/qiwi/multi-semantic-release/commit/828a82d88d0692aa3bc19dd8dae5674a46a719ce))

# [1.1.0](https://github.com/qiwi/multi-semantic-release/compare/v1.0.3...v1.1.0) (2019-11-03)


### Bug Fixes

* **package:** add missed sem-rel plugins ([f3c9318](https://github.com/qiwi/multi-semantic-release/commit/f3c9318aa76ac7ec10c4bb45782d8d775b1885d9))
* **package:** update execa to be compatible with sem-rel 15.13.28 ([069bb4e](https://github.com/qiwi/multi-semantic-release/commit/069bb4e943223a712398b35f78abcfc2a43b6323)), closes [#7](https://github.com/qiwi/multi-semantic-release/issues/7)
* force a release ([1e3ece5](https://github.com/qiwi/multi-semantic-release/commit/1e3ece5e03a5e39a2e100edaf8bead26245d0a12))


### Features

* add execasync CLI flag to make execa calls be always synchronous ([693438c](https://github.com/qiwi/multi-semantic-release/commit/693438caeb64af083a6db4e6634aaac74da112ad)), closes [#1](https://github.com/qiwi/multi-semantic-release/issues/1)
