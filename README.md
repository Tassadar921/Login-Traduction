This project is a connection and  translation module, including both front (Ionic framework based on angular) and back (Node JS express server + Edgedb project files).

In order to launch it, run those commands in a terminal (make sure you've got Node JS installed and updated) :

First of all, create a .env file in /back containing the following lines :

```
EDGEDB_INSTANCE=<string> // name of your edgedb instance
EMAIL=<string> // email address used to send emails
EMAIL_SERVICE=<string> // email service used to send emails (gmail, outlook, etc.)
EMAIL_PASSWORD=<string> // application password of the email address
PORT=<number> // port used by the server
URL_TOKEN_LENGTH=<number> // length of the url token sent by email
SESSION_TOKEN_LENGTH=<number> // length of the token used to authenticate the user
URL_TOKEN_TIMEOUT_DELAY=<number> // delay in milliseconds before the url token expires
URL_FRONT=<string>
```

Fill the brackets with the appropriate values.

```
- npm i @angular/cli -g
- npm i @ionic/cli -g
```

Make sure you have EdgeDB installed on your computer (https://edgedb.com/download).
- In the /database folder :

```
edgedb project init <EDGEDB_INSTANCE>
```


- go in the /back folder:

```
- npm i
- node server.js
```

- in another terminal, go in the /front folder:

```
- npm i
- ionic serve
```

Enjoy !

