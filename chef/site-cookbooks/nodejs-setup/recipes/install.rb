# version should be 0.10, 0.12, 4.x, 5.x
prefix = "https://deb.nodesource.com/setup_"
version = "4.x"

if node["nodejs"]["version"]
  version = node["nodejs"]["version"]
end

install_url = [prefix, version].join("")

bash "setup node" do
  code <<-EOH
sudo apt-get install -y build-essential
sudo apt-get install curl -y
curl -sL #{install_url} | sudo -E bash -
sudo apt-get install -y nodejs
    EOH
  not_if { ::File.exists?("/usr/bin/node") }

end

# install npm packages
bash "setup npm packages"  do
  code <<-EOH
sudo npm install -g #{node["nodejs"]["npm_packages"].join(" ")}
    EOH
  only_if {node["nodejs"]["npm_packages"].any? { |package_name| !::File.exists?(["/usr/bin/", package_name].join("")) }}
end