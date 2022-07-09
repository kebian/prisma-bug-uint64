
# Problem with using unsigned bigints with MySQL / MariaDB

[GitHub issue #14231](https://github.com/prisma/prisma/issues/14231)

### Bug description

Prisma will create the correct native types for mariadb / mysql but there are still problems using unsigned bigints in Prisma because it attempts to force them in to signed 64 bit integers and then throws an error when it fails.


### How to reproduce

Clone this repository
```bash
$ git clone https://github.com/kebian/prisma-bug-uint64
```
Install dependencies
```bash
$ npm ci
```

Create a `.env` file in the project root and add your database credentials in the following format
```
DATABASE_URL="mysql://username:password@127.0.0.1:3306/bug-test"
```

Run the example
```bash
$ npm start
```


Full debug output:
```
prisma:tryLoadEnv  Environment variables loaded from /Users/robs/dev/prisma-bug-uint64/.env +0ms
  prisma:tryLoadEnv  Environment variables loaded from /Users/robs/dev/prisma-bug-uint64/.env +1ms
  prisma:client  dirname /Users/robs/dev/prisma-bug-uint64/node_modules/.prisma/client +0ms
  prisma:client  relativePath ../../../prisma +0ms
  prisma:client  cwd /Users/robs/dev/prisma-bug-uint64/prisma +0ms
  prisma:client  clientVersion: 4.0.0 +0ms
  prisma:client  clientEngineType: library +0ms
  prisma:client:libraryEngine  internalSetup +0ms
bigval is 32000000000000000000n
  prisma:client:libraryEngine:loader  Searching for Query Engine Library in /Users/robs/dev/prisma-bug-uint64/node_modules/.prisma/client +0ms
  prisma:client:libraryEngine:loader  loadEngine using /Users/robs/dev/prisma-bug-uint64/node_modules/.prisma/client/libquery_engine-darwin-arm64.dylib.node +0ms
  prisma:client  Prisma Client call: +53ms
  prisma:client  prisma.nft.create({
  data: {
    price: '32000000000000000000'
  }
}) +0ms
  prisma:client  Generated request: +0ms
  prisma:client  mutation {
  createOneNft(data: {
    price: 32000000000000000000
  }) {
    id
    price
  }
}
 +0ms
  prisma:client:libraryEngine  sending request, this.libraryStarted: false +54ms
  prisma:client:libraryEngine  library starting +0ms
  prisma:client:libraryEngine  library started +32ms
  prisma:client:request_handler  PrismaClientKnownRequestError: Query parsing failure: A number used in the query does not fit into a 64 bit signed integer. Consider using `BigInt` as field type if you're trying to store large integers.
    at prismaGraphQLToJSError (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:43455:12)
    at LibraryEngine.buildQueryError (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:45535:12)
    at LibraryEngine.request (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:45472:22)
    at async RequestHandler.request (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:49636:24)
    at async PrismaClient._request (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:50572:18)
    at async main (/Users/robs/dev/prisma-bug-uint64/src/index.ts:14:5) {
  code: 'P2033',
  clientVersion: '4.0.0',
  meta: {
    details: "Query parsing failure: A number used in the query does not fit into a 64 bit signed integer. Consider using `BigInt` as field type if you're trying to store large integers."
  }
} +0ms
PrismaClientKnownRequestError: 
Invalid `db.nft.create()` invocation in
/Users/robs/dev/prisma-bug-uint64/src/index.ts:14:18

  11 // This will throw a PrismaClientKnownRequestError error of P2033
  12 // Query parsing failure: A number used in the query does not fit into a 64 bit signed integer. Consider using `BigInt` as field 
  13 // type if you're trying to store large integers.
→ 14 await db.nft.create(
  Query parsing failure: A number used in the query does not fit into a 64 bit signed integer. Consider using `BigInt` as field type if you're trying to store large integers.
    at RequestHandler.handleRequestError (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:49670:13)
    at RequestHandler.request (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:49652:12)
    at async PrismaClient._request (/Users/robs/dev/prisma-bug-uint64/node_modules/@prisma/client/runtime/index.js:50572:18)
    at async main (/Users/robs/dev/prisma-bug-uint64/src/index.ts:14:5) {
  code: 'P2033',
  clientVersion: '4.0.0',
  meta: {
    details: "Query parsing failure: A number used in the query does not fit into a 64 bit signed integer. Consider using `BigInt` as field type if you're trying to store large integers."
  }
}
  prisma:client:libraryEngine  hookProcess received: beforeExit +5ms
  prisma:client:libraryEngine  runBeforeExit +0ms
  prisma:client:libraryEngine  hookProcess received: exit +0ms
```

### Expected behavior

The unsigned value should not be ranged checked within the signed range and the value should be written to the db table.

### Prisma information
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Nft {
  id    String @id @default(uuid())
  price BigInt @db.UnsignedBigInt // The field is created as unsigned
}
```

### Environment & setup

- OS:  Mac OS
- Database:  MariaDB 10.8.3-jammy
- Node.js version: v18.4.0


### Prisma Version

```
prisma                  : 4.0.0
@prisma/client          : 4.0.0
Current platform        : darwin-arm64
Query Engine (Node-API) : libquery-engine da41d2bb3406da22087b849f0e911199ba4fbf11 (at node_modules/@prisma/engines/libquery_engine-darwin-arm64.dylib.node)
Migration Engine        : migration-engine-cli da41d2bb3406da22087b849f0e911199ba4fbf11 (at node_modules/@prisma/engines/migration-engine-darwin-arm64)
Introspection Engine    : introspection-core da41d2bb3406da22087b849f0e911199ba4fbf11 (at node_modules/@prisma/engines/introspection-engine-darwin-arm64)
Format Binary           : prisma-fmt da41d2bb3406da22087b849f0e911199ba4fbf11 (at node_modules/@prisma/engines/prisma-fmt-darwin-arm64)
Default Engines Hash    : da41d2bb3406da22087b849f0e911199ba4fbf11
Studio                  : 0.465.0
```
