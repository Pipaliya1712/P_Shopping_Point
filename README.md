# P Shopping Point

## Project Description:
P Shopping Point is a dynamic web application for selling blazers, featuring personalized profiles, secure authentication, and email verification via OTP. It showcases skills in web development, database management, and security protocols. The app is built with NodeJS, ExpressJS, and MongoDB, ensuring user data protection.

## Dependencies:
- bcrypt: ^5.1.1
- body-parser: ^1.20.2
- cookie-parser: ^1.4.6
- dotenv: ^16.4.5
- ejs: ^3.1.9
- express: ^4.18.2
- fs: ^0.0.1-security
- html-pdf: ^3.0.1
- jsonwebtoken: ^9.0.2
- mongoose: ^8.4.0
- multer: ^1.4.5-lts.1
- nodemailer: ^6.9.10
- nodemon: ^3.1.1
- path: ^0.12.7
- pdfkit: ^0.15.0
- url: ^0.11.3

## Steps to Run Locally:
1. Download the zip file and extract it.
2. Open it in your code editor.
3. Run `npm install` in your console to install dependencies.
4. Connect your MongoDB database.
5. Run `npm run dev` in your console.

## Live URL Link:
[Click here to visit P Shopping Point](https://p-shopping-point.onrender.com)

## Current Bug:
In the profile page, there is an option for "My Orders." After clicking on that, the list of orders is shown, and then there is also an option for a bill for each order. After clicking on that, the bill of that order is generated, and there is also an option to download it. However, currently, this download functionality is working, but the button is not shown on the live website. It works well locally.
