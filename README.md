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
DB_HOST=mysql_url
DB_NAME=mysql_schema
DB_USER=mysql_user
DB_PASS=mysql_pass
S3_ACCESS_KEY=amazon.s3.access-key
S3_SECRET_KEY=amazon.s3.secret-key
S3_ENDPOINT=amazon.s3.endpoint
S3_BUCKET_NAME=amazon.s3.bucket-name
STRIPE_SECRET_KEY=stripe.secret-key
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
- [expect](https://jestjs.io/docs/expect)
- [Jest Mocks](https://jestjs.io/docs/mock-functions)
- [Supertest](https://github.com/ladjs/supertest)
