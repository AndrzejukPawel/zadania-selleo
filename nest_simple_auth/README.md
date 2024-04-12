# API with authentication
It is a solution for task described in nest_simple_auth.md<br>

API allowing users to register an account using an email address and password.<br>
After registering an account user can generate new bearer token.<br>
With that token user can call /users endpoint to retrieve all users from the database.

## Installation

```bash
$ npm install
```

## Env file

- `DATABASE_URL` - Path to the database

## Database

All data is saved in sqlite database located in `./prisma/database.db`

## Endpoints

#### Creating user account
<details>
 <summary><code>POST <b>/</b>user<b>/</b>register</code></summary>

##### Body Parameters

> | name                |  type     | data type |
> |---------------------|-----------|-----------|
> | email               |  required | string    |
> | password            |  required | string    |
> | firstName           |  optional | string    | 
> | lastName            |  optional | string    | 
> | phoneNumber         |  optional | string    | 
> | shirtSize           |  optional | string    | 
> | preferredTechnology |  optional | string    | 

##### Example cURL creating `/abc/file.txt` file with `Hello world!` text

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/user/register -d "{\"email\": \"test5@test.test\",\"password\": \"TestTest1!\",\"firstName\": \"test\",\"lastName\": \"test\",\"phoneNumber\": \"test\",\"shirtSize\": \"test\",\"preferredTechnology\": \"test\"}"
> ```

</details>

#### Logging in
<details>
 <summary><code>POST <b>/</b>auth<b>/</b>signin</code></summary>

##### Body Parameters

> | name                |  type     | data type |
> |---------------------|-----------|-----------|
> | email               |  required | string    |
> | password            |  required | string    |

##### Returns
An object containing bearer token

##### Example cURL generating new authorization token

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/auth/signin -d "{\"email\": \"test5@test.test\",\"password\": \"TestTest1!\"}"
> ```

</details>

#### Fetching list of all registered users
<details>
 <summary><code>GET <b>/</b>users</code></summary>

### ! Requires `Authorization` header with a valid bearer token

##### Returns
An object containing bearer token

##### Example cURL creating `/abc/file.txt` file with `Hello world!` text

> ```javascript
>  curl -X GET -H "Content-Type: application/json" -H "Authorization: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q1QHRlc3QudGVzdCIsImlhdCI6MTcxMjg1Mjk2MywiZXhwIjoxNzEyODUzODYzfQ.wwOlYaqMRdni3ZiWsjXecfyV9dR-yX5tQue8SB_lseg" localhost:3000/users
> ```

</details>

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
