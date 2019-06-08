WeeWikiPaint
============

## Prerequisites

1. NodeJS (Ubuntu)
Install the version 6 repo with:

        curl -sL https://deb.nodesource.com/setup_6.x| sudo -E bash -
        sudo apt install nodejs

2. Node dependencies
Install dependencies listed in `package.json`:

        npm install

3. (Optional) travis cli

        sudo apt install ruby-dev && sudo gem install travis

## Deployment

1. Install heroku app

        sudo snap install --classic heroku

2. Login, deploy and check status

        heroku login
        git push heroku master
        heroku ps

## Starting/stopping the webapp

The webapp is started automatically after a heroku push.
It will sleep after 30 minutes of inactivity but stay available.

It can be stopped via:

        heroku ps:scale web=0

And restarted via:

        heroku ps:scale web=0
