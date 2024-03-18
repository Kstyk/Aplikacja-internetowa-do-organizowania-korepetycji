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
