VagrantDockerBoilerplate
========================
STILL UNDER CONSTRUCTION.....

This is a basic boilerplate for setting up a VM using Vagrant and running Docker containers in that VM. This setup will allow you to make changes to source code on your host OS and reflect those changes to a Docker container running on the VM's OS at run time.

I spent a lot of time getting the Vagrant-Docker setup that I wanted and figured that others probably encountered the same frustration and pain that I encountered, so I am hoping that this boilerplate will help those poor soles on their way.

NB: This boilerplate is based on the idea that you will run a node project.

#Prerequisites#
Assuming that you have basic knowledge about Vagrant and Docker: all you need is [Virtual Box](https://www.virtualbox.org/) and [Vagrant](https://www.vagrantup.com/).

#How the set up works#
The VM uses CentOS 7.0 (other VM's probably works as well, but I got it working with CentOS).

##Folder syncing from host to VM##
The project folder is shared to a folder in the VM called ```myApplication```.
Every file and folder in the ```myApplication``` folder is readable, writable and executable by everyone (777).

```
config.vm.synced_folder ".", "/myApplication",mount_options: ["dmode=777","fmode=777"]
```

My usage for Vagrant has been in development so there was no great harm in using this setup. Do change it if you have other needs.
What I discovered was that the ```mount_options``` was essential for making the set up work with Docker. This allows another user (e.g. docker) to write to the files and folders in the ```myApplication``` directory. The OS that the VM uses must support the mount_option option for this setup to work.

##Provisioning##
This section explains how the VM is provisioned at creation and at every startup.

###VM creation###
On first startup (when you first create the VM) Vagrant will run a shell script called bootstrapVM.
The bootstrapVM script will update packages,
install Docker and build a Docker image from the Dockerfile.

When Docker creates the image it first pulls down and executes the nodejs image from the official [Docker Hub Registry](https://registry.hub.docker.com/).
Then the ```app``` folder from the VM is copied into a new folder in the Docker image called ```myApplication```. The ```app```folder should contain the source code for your (node) project and configuration files such as package.json.
The Gulp build tool is then installed. You can of course change this since Gulp is not actually needed for the Vagrant-Docker setup to work.
Then the working directory is set to the ```myApplication``` directory in the Docker image.
Lastly your npm packages will be installed (given that you have a package.json file in the ```app``` folder in the VM).

###Starting Docker###
Every time the VM starts the Docker service will restart (there were some issues with Docker when logging in and out of the VM). This is also done using a shell provision (inline in the Vagrant file).
```
cos.vm.provision "shell", run: "always", inline: "sudo service docker restart"
```

###Running a Docker container###
Each time the VM starts it will run a Docker container based on the Docker image that was built in the bootstrapping process.
```
cos.vm.provision "docker", run: "always" do |d|
  d.run "application_image",
    args: "-it -p 8080:8080 -v /myApplication/app:/myApplication",
    cmd: "/bin/bash -c 'npm install;gulp dev;'"
end
```
Using the ```-v ``` options is what makes the ```myApplication/app``` folder on the VM synced to the folder in the Docker container
(ADD in the Docker file is only a copy job). It will also overwrite the existing ```myAppplication``` folder in the Docker image.
This is basically what is happening: The ```app```folder in the ```myAppplication``` folder
on the VM is synced to a (new) folder in the Docker container also called ```myApplication```. So every change that is made in the ```app```folder on the host (which is synced to the VM) can be reflected to the Docker container at run time.


##Known issues##
There has been problems with running `vagrant up` or `vagrant reload` after running `vagrant halt`. The issue is believed to related to VirtualBox and/or/with synced folders. If you encounter this issue you can try to install the [vagrant-vbguest](https://github.com/dotless-de/vagrant-vbguest) plugin.

```
vagrant plugin install vagrant-vbguest
```
