# URL - Shortener

## server

### db

- connection.js - mongodb connection
  - uses mongoose
- schema
  - user
    - {username, email, passwordHash, urlLimit}
  - passwordReset
    - {userId, token, expiry}
  - url
    - {userId, token, url}

### routes

- /auth
  - /register (register new user)
  - /login (user login)
  - /check-unique (check unique username or email)
  - /authorize (user authorization - verify jwt)
  - /password-reset (reset password)
    - /create (create password reset entry and send email)
    - /verify (verify and check expiry of password reset token)
    - /update (update password if password reset token is valid)
  - authHandlers.js and passwordResetHandlers.js (all the auth route handlers are defined in these files)
- /urls
  - get (get url)
  - post (add url)
  - delete (delete url)
  - patch (edit url)
  - urlHandlers.js contains handlers for the above url routes
- /urlToken - redirect to url stored

- npm packages used
  - mongoose (to connect and interact with mongodb database)
  - volleyball (http request response logger)
  - cors (to handle cors)
  - bcrypt (to hash and verify password)
  - jsonwebtoken (to create and verify auth tokens)
  - nanoid (to create unique tokens for password reset)
  - nodemailer (to send password reset mail - uses sendinblue smtp server)

## client

### pages

- Auth
  - Register.js - register new user
  - Login.js - user login
  - PasswordResetCreate.js - create password reset entry
  - PasswordResetUpdate.js - update password
  - User.js - user page after user logged in. contains logout.
- Urls
  - UrlList.js (shortened url list)
  - AddUrl.js (add new shortened url)

### routes

- /register - Register.js
- /login - Login.js
- /password-reset
  - /create - PasswordResetCreate.js
  - /update - PasswordResetUpdate.js
- /urls
  - /all - UrlList.js
  - /add - AddUrl.js

### context

- Auth context
  - contains login, register, logout, createPasswordReset, verifyPasswordReset, updatePassword
  - state
    - user (contains user details)
  - effects
    - authorize
      - makes use of local storage to store user jwt.

### hooks

- useDebounceValue
  - validates and check username and email for uniqueness in the register page as the user types
  - the value is also debounced (previous call is cancelled if user continues to type)
