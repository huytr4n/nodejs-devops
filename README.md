# Best Practice For Node.js

## Features
 - Generate Node.js project template
 - Node.js 0.10, 0.12, 4.x
 - MongoDB
 - Chef
 - Vagrant
 - Server deployment (fabric)


## Constraints
 - [node.js](https://www.nodejs.org) version: 0.10, 0.12, 4.x
 - [vagrant](https://www.vagrantup.com/)
 - [chef-dk](https://downloads.chef.io/chef-dk/)


## Usage

### Install needed gem

    gem install knife-solo
    gem install berkshelf


### Init project structure

    mkdir <project_name> && cd <project_name>
    git clone git@gitlab.asoft-python.com:g-huytran/nodejs-gitlabci-practice.git


### Development env with Vagrant
    cd vagrant/
    vagrant up
    vagrant ssh

    cd ../chef/
    sudo knife solo bootstrap vagrant@10.0.0.2 -P vagrant


## Testing
### Test your code with lab
    npm test


### JSLint
    npm run lint


## Deployment
### With github
    knife solo boostrap root@[server-ip]
    or knife solo cook root@[server-ip]

### With rsync
    node backend/deployment/sync.js --dest=server
    knife solo boostrap root@[server-ip]
    or knife solo cook root@[server-ip]

Note: a JSON file of --dest param must be existed on config folder


## Folder structure

### Local Repository

1. **chef**: contains chef configuration + cookbooks
2. **backend**: contains all backend code
3. **.gitlab-ci.yml**: gitlab configuration
4. **install.sh**: install environment for gitlab runner
5. **vagrant**: vagrant configuration


## Troubleshooting
TODO
