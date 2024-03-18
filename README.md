# Web Application for Organizing Foreign Language Tutoring

In this repository you can explore the code of my full-stack project, which is a web app for organizing foreign language tutoring online or stationary.

Technologies used in project:

<div id="badges">
  <a href="#">
    <img src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" alt="Django Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white" alt="Redis Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL Badge"/>
  </a>
</div>

## About the project

The goal of the project, is to create a platform, where students and teachers can meet together. After buying classes by a student, the room with both - student and teacher - is creating.
In that room, users has possibility to use text chat in real time, making video calls, share the screen, upload, download, view files.

In the app there also possibility to buy classes and give classes stationary, at the teacher address or selected by student address.

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/a17cfa25-1cca-419e-81e7-6b5f7f827d54)

## Instalation

1. Install the following dependencies and software:

   - **Python** - `>= 3.8.0`
   - Install globally virtualenv (**pip install virtualenv**)
   - **NodeJS** - `>= 18.12.0`
   - **Yarn** `npm i --global yarn`
   - **Docker** - this one is optionally - install docker to create a container for MySQL Database Server, Redis Database and PeerJS instance, or use different tools to create them.

   In MySQL Database Server, create a database called `inzynier`, with `utf-8` charset.

2. Frontend

   - Go to the `frontend` folder.
   - After installing NodeJS, you can download all dependencies to the project running `npm i` or `yarn add`.
   - Run the app with `yarn run dev` command.
   - Open `http://localhost:5173` to see if it is working.

3. Backend
   - Go to the `backend` folder.
   - Create virtual environment in current folder with `virtual venv` command.
   - Install dependencies for Django project with `pip install -r requirements.txt` command.
   - Run the migrations by executing commands `python manage.py migrate`. Seed the cities database with `./manage.py cities_light`.
   - Run the app by running `python manage.py runserver`.

After all steps above, the app should working fine on `http://localhost:5173/`. You can open the register page and create your first account.

## About used technologies

### Backend

My application is REST API app, so I used `Django Rest Framework` with Django to make creating an API easier. That application using a few features in real time, which need a WebSocket protocol. With `Django Channels` and `Redis` I'm sending needed communications between two users without need sending a request, for example sending a notification about new message in the room. Datas are stored in MySQL Database. To authorize user I'm using `SimpleJWT` library, which uses JWT tokens.

### Frontend

With all features which React gives at the start, I used `react-router-dom` to handle routing in the app. To keep some important datas, such as information about logged user, I used `React Context`, not Redux or any other more advanced state managament library. To style components I used `TailwindCSS`, in few places I used additional files with styles in `scss` syntax. I'm using `PeerJS` library - wraps the browser's WebRTC implementation and provide a easy-to-use p2p connection API. It is used to make video calls between student and teacher.

## Live Application

Below I will show the app looks like by showing the most important features.

### Auth Features

##### Login Page

![alt text](image-2.png)

##### Registration Page

![alt text](image-1.png)

##### Reset Password by providing email

![alt text](image-3.png)

<hr />

### Teacher's Features

##### Profile View

![alt text](image-4.png)

##### Edit Base Profile

![alt text](image-5.png)

##### Edit More Infos

![alt text](image-6.png)

##### Change Avatar

![alt text](image-7.png)

##### Change Password

![alt text](image-8.png)

##### Setting Schedule

![alt text](image-9.png)

##### Create New Classes

![alt text](image-10.png)

##### List Of Created Classes

![alt text](image-11.png)

##### History of Sold Classes

![alt text](image-12.png)

##### Teacher's Schedule

![alt text](image-13.png)
![alt text](image-14.png)

<hr />

### Student's Features

##### Searching Classes

![alt text](image-15.png)

##### Classes Info Page

![alt text](image-16.png)

##### Buying Classes

![alt text](image-17.png)
![alt text](image-18.png)

<hr />

### Private Rooms

##### List of Private Rooms

They're created after buying the classes by student. If room between teacher and student already exists, there is not created another room.

The number in the blue box in the top right corner of every card means how many messages logged user has not read in that room - for example one unreaded message in room with Anna Kowalska.

![alt text](image-20.png)

##### Real-Time Chat in Room

![alt text](image-21.png)

##### Upload, Download and View Files in Room

![alt text](image-22.png)

##### Schedule in the Room

![](image-23.png)

##### Adding an Opinion to Teacher

![](image-24.png)

Preview the Opinion in the Teacher Profile:
![alt text](image-25.png)

##### Video Call

![alt text](image-26.png)

Incoming Notification
![alt text](image-27.png)
![alt text](image-28.png)

One user sharing Visual Studio Code, when the other has only turned on video camera.

Sharing user:
![alt text](image-29.png)

Receiving user:
![alt text](image-30.png)
