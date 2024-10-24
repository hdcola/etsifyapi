# etsifyapi

## Development

### Setup

```bash
pnpm install
```

### .env

Create a `.env` file in the root of the project with the following content:

```
JWT_SECRET=your_jwtsecret
```

### Run the development server

```bash
pnpm dev
```


### Run tests

Install [Orta.vscode-jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) in your VSCode and run the tests from there.

Run the tests in CLI:

```bash
pnpm test
```

Refresh the coverage report:

```bash
pnpm test -- --coverage
```

#### References

- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest)
- [expect](https://jestjs.io/docs/expect)