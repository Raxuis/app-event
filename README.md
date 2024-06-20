<div align="center" id="top"> 
  <img src="https://i.ibb.co/WvMgft1/app-event.jpg" alt="app-event-banner" />

&#xa0;

</div>

<h1 align="center">App-Event</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/Raxuis/app-event?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/Raxuis/app-event?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Raxuis/app-event?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/Raxuis/app-event?color=56BEB8">
</p>

<hr>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/Raxuis" target="_blank">Author</a>
</p>

<br>

## :dart: About

App-Event is a SaaS-like event planing platform that allows you to create events, invite people to them and export datas about them.

## :sparkles: Features

🖍️ Create your event thanks to an event model\
✎ Create your own event\
✍️ Edit your event\
➕ Add custom fields to you event like Price, Special Guests etc...\
👨 Edit your profile\
🎪 Add resources to your event\
👷‍♂️ Handle resources => Increment, Decrement Quantity and Edit Resources\
☑︎ Declare available to this event or not\
📁 Export your event infos to PDF or CSV\
🚫 Delete your event

## :rocket: Technologies

The following tools were used in this project:

- [JavaScript](https://developer.mozilla.org/fr/)
- [TailwindCSS](https://tailwindcss.com/)
- [PHP](https://www.php.net/)
- [MySQL](https://www.mysql.com/fr/)

## :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.

## :checkered_flag: Starting

### Cloning, adding environment variables

```bash
# Clone this project with GitHub
$ git clone https://github.com/Raxuis/app-event.git

# Clone this project with GitLab
$ git clone https://gitlab.com/Raxuis/app-event.git

# Access
$ cd app-event

# Create a .env file
$ touch frontend/.env

# Fill it with your frontend and backend ports by following the .env.example
```

### Frontend Installation

```bash
# Go to frontend folder
$ cd frontend

# Install dependencies
$ npm install

# Run the project
$ npm start

# The server will initialize in the <http://127.0.0.1:9090>
```

### Backend Installation

```bash
# Go to backend folder
$ cd backend

# Install dependencies
$ composer install

# Look for all the classes and files it needs to include again
$ composer dump-autoload

# Start your Nginx server and PHP server

# 👇 For MacOS
$ brew services start php@8.3 && brew services start nginx

# 👇 For Windows
$ sudo systemctl start php@8.3 && sudo systemctl start nginx

# Start your MAMP / XAMP / LAMP server

# Upload on PHPMyAdmin the database app_event.sql which is in the database folder

# The server will initialize on the port specified in the Nginx configuration file
```

## :memo: License

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.

Made with :heart: by <a href="https://github.com/Raxuis" target="_blank">Raphaël</a>

&#xa0;

<a href="#top">Back to top</a>
