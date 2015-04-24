# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  #Set the Vagrant box, need to support mount_options for synced_folder
  config.vm.box = "chef/centos-7.0"

  # Defaults to true, but due to a recent issue the vbugest installation may fail.....
  # Remove when fixed
  #config.vbguest.auto_update = false;
  #config.vbguest.auto_reboot = false;

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 8080 on the guest machine.

  config.vm.network "forwarded_port", guest: 8080, host: 8080

  # dmode = directory mode, fmode = filemode
  config.vm.synced_folder ".", "/myApplication", mount_options: ["dmode=777","fmode=777"]

  #Define the box
  config.vm.define "CentOS" do |cos|

    #Set provisioning. Provisions are run in the order specified in the Vagrantfile

    # Only run on first vagrant up
    cos.vm.provision "bootstrapVM", type: "shell" do |s|
      s.path = "bootstrapVM.sh"
    end

    #Restart the docker service
    cos.vm.provision "shell", run: "always", inline: "sudo service docker restart"

    cos.vm.provision "docker", run: "always" do |d|
      d.run "application_image",
        args: "-it -p 8080:8080 -v /myApplication/app:/myApplication",
        cmd: "/bin/bash -c 'npm install;gulp dev;'"
    end
  end
end
