# Install node & global modules

if ! which node > /dev/null; then
   echo "##### Installing nodejs 4.x"

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
