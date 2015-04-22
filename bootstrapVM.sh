#!/usr/bin/env bash
echo -e '\n'
echo -e '#######################
# Update yum packages #
#######################\n.'
sudo yum update -y

echo -e '\n'
echo -e '##################
# Install Docker #
##################\n.'
sudo yum install -y docker

echo -e '\n'
echo -e '#############################
# Building Docker container #
#############################\n.'
cd /myApplication
#Adding root user to docker group
sudo gpasswd -a $USER docker
#Restarting docker service
sudo service docker restart
#Building Docker image
docker build -t application_image .

echo -e '\n'
echo -e '############################
# Running Docker container #
############################\n.'
