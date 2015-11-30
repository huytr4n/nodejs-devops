#
# Cookbook Name:: deployment
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

source_code_dir = ''

if node['deployment']['rsync'] == false
  # create folder
  directory node['deployment']['dir'] do
    owner 'root'
    group 'root'
    mode '0755'
    action :create
    recursive true
  end

  # copy ssh key
  if node['deployment']['sshkey']
    owner 'root'
    group 'root'
    mode 0400
    lazy { ::File.open(node['deployment']['sshkey']).read }
    action :create
  end

  # clone code
  deploy_branch node['deployment']['dir'] do
    scm_provider Chef::Provider::Git
    repo node['deployment']['git']
    revision node['deployment']['branch']

    # Clear out all the symlink attributes
    symlink_before_migrate.clear
    create_dirs_before_symlink.clear
    purge_before_symlink.clear
    symlinks.clear

    enable_submodules true
    shallow_clone false
    action :deploy
  end

  # set source dir
  source_code_dir = node['deployment']['current']
else
  source_code_dir = node['deployment']['rsync_folder']
end

# start server
bash 'Start backend server' do
  user 'root'
  code <<-EOH
    cd #{source_code_dir}
    npm install
    forever stop bin/start
    forever start bin/start
  EOH
end
