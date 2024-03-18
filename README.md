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

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/8a2b6a25-cc05-44a9-8450-9de97f5fbaaa)

##### Registration Page

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/fd516127-0524-4857-8ecc-f358f4bbb946)

##### Reset Password by providing email

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/ed88e9fb-c77d-4c84-ac30-eb56e174aef1)

<hr />

### Teacher's Features

##### Profile View

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/fcb11e38-e9c2-4df2-a949-6cb86b04d498)

##### Edit Base Profile

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/191758d0-cd47-4571-b47b-9372a271270f)

##### Edit More Infos

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/96ec49e1-b7ec-4197-80da-a4afed15d706)

##### Change Avatar

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/2c272bfd-6fac-463f-b549-c4276656ceff)

##### Change Password

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/209dd7b8-fb8e-478a-9616-846f8d9334f6)

##### Setting Schedule

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/62af48ee-83ac-498b-846a-e8d8ab2d8900)

##### Create New Classes

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/6b980714-ab3e-45c9-ae58-08d8aa05f9e1)

##### List Of Created Classes

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/0969cb76-beb0-4d25-900e-24b307b6a512)

##### History of Sold Classes

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/fd0fc334-daf5-4860-ab5f-6d6aa29d7e00)

##### Teacher's Schedule

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/def9ec00-819e-49f4-98ce-4aea3f2a6a91)
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/4f849a88-85d3-441e-bd52-3060e8156b07)

<hr />

### Student's Features

##### Searching Classes

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/a486f8ed-760e-4c22-ab5f-6f889f093e83)

##### Classes Info Page

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/4afea901-ec48-411d-bfb4-62671ddd35fa)

##### Buying Classes

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/93de7130-a4cf-4eb8-8fd2-76f04bab3102)
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/999e8bdf-dacb-472d-bc4b-66c255175431)

<hr />

### Private Rooms

##### List of Private Rooms

They're created after buying the classes by student. If room between teacher and student already exists, there is not created another room.

The number in the blue box in the top right corner of every card means how many messages logged user has not read in that room - for example one unreaded message in room with Anna Kowalska.

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/1be97a11-a980-4328-b04d-c66f905c396e)

##### Real-Time Chat in Room

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/2ba1bb54-7764-4672-aca9-bbc38202692f)

##### Upload, Download and View Files in Room

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/b242acc2-80d1-480f-9fd1-2c3b3c9ec9ce)

##### Schedule in the Room

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/6874b37b-c627-48f2-b176-5293cdbcacb5)

##### Adding an Opinion to Teacher

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/ecfad178-0e45-4b55-84dd-3204fb6a4346)

Preview the Opinion in the Teacher Profile:

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/d4bf53eb-3367-4e6c-8377-045be59de1f4)

##### Video Call

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/5faea0ae-e34c-4354-a123-5750487fea00)

Incoming Notification

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/5a69bafc-c663-449a-bd92-cf25ca9d3927)
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/71659b6c-9be4-480f-a23f-2a5eb618aca2)

One user sharing Visual Studio Code, when the other has only turned on video camera.

Sharing user:

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/f43629cb-72a8-4d88-a679-793d5b05eb8f)

Receiving user:

![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/de6b0354-cfeb-4501-a05a-e5ab6eb415ca)

### Inbox Page - no private room required
##### Sending First Message
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/22f29eac-1f12-4bd3-b684-704f84c9f93e)
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/acf95735-8f2f-4e9b-8200-5ae0c486d37f)

##### Inbox
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/25350067-160e-4a28-a0ab-ce720179db01)
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/1d49c828-832b-4283-92f4-dc6815064cc3)
![image](https://github.com/Kstyk/Web-Application-for-Organizing-Foreign-Language-Tutoring/assets/80002380/e46449d8-ecc0-4a0d-8581-c0d5516f0cc9)

## Summary
At the end, with creating that project, I learn a lot of new skills. I knew Django earlier, but I used here a lot of new libraries to me. That was my first big project with using React, I can say I enjoy that framework. A lot of useful libraries are also helpful, like a `react-hook-forms` which helps a lot with validating forms. What I would to add to this project? Well, for sure I want to add a module to create tests/exams by a teacher and attaching it to selected student, which could help with improving skills. I'd like to refactor frontend code to use TypeScript. One more feature, which will be a lot easier to implement, is that to not only allowing to create a lesson about foreign languages but also about, let's say, math, chemistry and other subjects. I'm sure that project has still a lot to do, and I will take a closer look to that in the future.
