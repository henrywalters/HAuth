![Hoth image](https://api.henrywalters.dev/v1/user-file/content/93992d98-49bd-4856-b0ed-648c9152c3b5.png)

# Hauth - fast and simple authentication and authorization for businesses

HAuth is an authorization microservice which provides:

- Organization (tenants) management
- Ability to create applications within an organization
- Fine grain control of applications with configurable and grantable permissions / roles
- User authentication via standard login method and OAuth

# Core Concepts

The basis of HAuth is the `Orgnaization`. Each organization has a unique domain associated with it. Organizations may optionally restrict users to this domain. 

Within each Organization exists many `Applications`. An application is a service that is accessible to users within an organization. `Privileges` may be created for an application (or organiation) which may be checked by the application for authentication. Decorators are provided in the `HauthLib`. Many privileges may be contained within a `Role` to ease administration. 

`Users` exist independently of organizations. A user is uniquely defined by their email. Users may be added to an organization and may be assigned organization and application level privileges and / or roles.

# Getting Started

## Installation

To run the app on your machine, you will need a database such as `mysql` and `Node v14`. 

After cloning the directory and navigating to it, run:

```npm install```

Create an `.env` file in the project directory with the following elements:

```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=[REPLACE ME]
DB_USER=[REPLACE ME]
DB_PASS=[REPLACE ME]

APP_SECRET=[REPLACE ME]
CRYPTO_ALGORITHM=sha256
CRYPTO_ENCODING=hex
TEXT_ENCODING=utf8

ACCESS_TOKEN_DUR=3600
REFRESH_TOKEN_DUR=31536000
```

Run the database migrations

```npm run build && npm run typeorm -- migration:run```

You are now ready to go

## Running the app

To run the app, simply use the command:

```npm run start:dev```.

To view documentation, navigate to:

```
http://localhost:3000/v1/docs
```
