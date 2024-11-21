
# Project Tracker - A simple MERN web application for keeping track of work-in-progress musical productions

The application is live [here](https://tracker.aceauramusic.com) for anyone to use!

## Features


<img align="right" width="200" src="https://github.com/user-attachments/assets/8d5a2f38-232d-4540-9571-ca8c904912fd" />

### Project Page

The "Project" is the main building-block of the application. Users can create Project cards in order to store useful information about tracks they're working on such as:
- **Project Name** - The name of the work-in-progress
- **Streaming Link** - An optional link to a streamable version of the track for quick and easy access. Adds a button to the top left of the card when entered
- **Priority Level** - How important the track is to finish
- **Due Date** - An optional date that the track needs to be completed by
- **Description** - Any additional notes about the track that you'd like to remember

The user can sort their Project cards in either ascending or descending order based upon a number of traits including:
- Date Updated
- Date Created
- Title
- Priority
- Due Date
- Completion % (How many to-do items completed out of total items)

### Detail Page

Each Project card when pressed will lead to a detailed view where a user can add to a list of items to complete for the track. This is an easy way for the user to take notes on what they would like to change or add to the track for their next production session.

On this page the user can also edit any of the data pertaining to the project card or delete the card entirely from the database.

## Tech Stack

Project Tracker utilizes the MERN (MongoDB, Express.js, React, Node.js) stack for its core functionality. Other tools utilized include:
- [React Router](https://reactrouter.com/en/main) - Client-side routing for React applications
- [Tailwind CSS](https://v2.tailwindcss.com/) - CSS framework
- [Discord Oauth2](https://discord.com/developers/docs/topics/oauth2) - Utilized to authenticate and authorize users
- [NextUI](https://nextui.org/) - Tailwind-based component library
- [LDRS](https://uiball.com/ldrs/) - Simple css loading animation
- [Font Awesome](https://fontawesome.com/) - SVG Icons
- [Mongoose](https://mongoosejs.com/) - Object modeling for MongoDB
- [Render.com](https://render.com/) - Deployment of client and server

Due to limitations with the tier of Render.com I an using to deploy the application, requests can take up to 50 seconds while the server is spinning up 🙃

## Development

### Dependencies

- Node.js
- NPM

### Running The Program (all instructions are relative to the root directory)

Install client dependencies:
> `cd client` <br>
> `npm install`

Run Client:
> `cd client` <br>
> `npm run dev`

Install server dependencies:
> `cd server` <br>
> `npm install`

Run Server:
> `cd server` <br>
> `nodemon server`
