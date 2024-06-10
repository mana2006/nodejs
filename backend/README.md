# nodejs

## System Requirements:

* cors >= 2.8.5
* dotenv >= 16.4.5
* Express >= 4.19.2
* Firebase >= 8.6.8
* Firebase admin >= 12.1.1
* Json web token >= 9.0.2
* Nodemailer => 6.9.13
* nodemon => 3.1.3

## Install project<br>
Copy `.env-copy` to `.env` and update your `.env` configuration file <br><br>
`npm install` <br>

## Structure :
- Controller (middware get and verify token before access next step)
- Model
- Routes
- Utils

## Run
`npm run start` <br>

### API
 - /auth/before_signup (POST): check email valid and send auth code

- /auth/signup (POST): insert email into firebase
-/auth/before_signin (POST): check email valid and send auth code
- /auth/signin (POST): return token after check auth code valid <br>

- /boards (POST): create board
- /boards (GET): get all board
- /boards/:id (GET): get board detail
- /boards/:id (PUT): update board
- /boards/:id (DELETE): delete board <br>

- /boards/:boardId/cards (POST): create card according to each board_id
- /boards/:boardId/cards (GET): get all get cards according to each board_id
- /boards/:boardId/invite (POST): invite people according to each board_id
- /boards/:boardId/cards/:id/invite/accept (POST): people accept into card according to each board_id
- /boards/:boardId/cards/:id (DELETE): delete board according to each board_id
