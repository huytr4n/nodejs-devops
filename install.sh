# Install node & global modules

if ! which node > /dev/null; then
   echo "##### installing nodejs 4.x"

   sudo apt-get install --yes build-essential
   sudo apt-get install curl --yest
   curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
   sudo apt-get install -y nodejs
fi

if ! which lab > /dev/null; then
  echo "#### install lab"

  sudo npm install -g lab
fi

if ! which xo > /dev/null; then
  echo "#### install xo"

  sudo npm install -g xo
fi

if ! which mongo > /dev/null; then
  echo "#### install mongodb"
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
  echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org=3.0.7 mongodb-org-server=3.0.7 mongodb-org-shell=3.0.7 mongodb-org-mongos=3.0.7 mongodb-org-tools=3.0.7
  sudo service mongod start
fi