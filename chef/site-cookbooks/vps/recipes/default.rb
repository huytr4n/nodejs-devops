#
# Cookbook Name:: vps
# Recipe:: default
#
# Copyright 2015, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

node.packages.each do |pkg|
    package pkg
end

# provision ssh
include_recipe 'openssh'
