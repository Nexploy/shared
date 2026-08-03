# @nexploy/shared

Shared primitives for [Nexploy](https://github.com/Nexploy/nexploy) — the pieces both the
application monorepo and [`@nexploy/nodes`](https://github.com/Nexploy/nodes) need, with no
dependency on either.

The package is deliberately dependency-free and framework-agnostic: it is consumed from a
Next.js app, a Hono service and a pipeline node library at once, so anything that would drag
in React, Docker bindings or the Prisma client belongs elsewhere.

## Install

```bash
pnpm add @nexploy/shared
```

## Modules

Every module is a subpath export.

| Import | Contents |
| --- | --- |
| `@nexploy/shared/actor` | `Actor` type, the `X-Nexploy-Actor-*` header names, and the encode/decode helpers used to propagate an actor across services |
| `@nexploy/shared/dockerConstants` | `NETWORK_DRIVERS`, `NETWORK_SCOPES`, `VOLUME_DRIVERS` |
| `@nexploy/shared/http-error` | `HttpError`, an `Error` carrying an HTTP status |
| `@nexploy/shared/nexployFilter` | Identifies and filters out Nexploy's own infrastructure containers and networks |
| `@nexploy/shared/pathSafety` | `safeResolvePath`, which rejects absolute paths and traversal outside a base directory |

```ts
import { safeResolvePath } from '@nexploy/shared/pathSafety';

safeResolvePath('/work/repo', 'src/index.ts'); // → /work/repo/src/index.ts
safeResolvePath('/work/repo', '../etc/passwd'); // → throws
```

The container and network filters are structurally typed, so they accept any shape carrying a
`name` and return it unchanged:

```ts
import { filterNexployContainers } from '@nexploy/shared/nexployFilter';

const visible = filterNexployContainers(containers); // keeps the caller's element type
```

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```

To work on this package against a local Nexploy or nodes checkout without publishing, run
`pnpm shared:local` from that repository — it packs this one and installs the tarball, which
is byte-for-byte what npm would serve. `pnpm shared:npm` restores the published version.

## Releasing

Publishing is driven by tags, not by commits. Push a `v*` tag and the
[`publish` workflow](.github/workflows/publish.yml) validates the version, typechecks, builds
and publishes with provenance:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The tag is the source of truth — `package.json` is aligned to it during the run, so a
forgotten version bump cannot publish the wrong number. A prerelease tag (`v0.2.0-rc.1`) is
published under the `next` dist-tag instead of `latest`.

## License

GPL-3.0
