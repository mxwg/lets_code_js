WeeWikiPaint
============

## Prerequisites

1. NodeJS (Ubuntu)
Install the version 6 repo with:

        curl -sL https://deb.nodesource.com/setup_6.x| sudo -E bash -
        sudo apt install nodejs

2. Node dependencies
For the real dependencies, also see `.travis.yml`.

        npm install jake
        npm install jslint
        npm install nodeunit

## Deployment

1. Install heroku app

        sudo snap install --classic heroku

2. Login & deploy

        heroku login
        git push heroku master
