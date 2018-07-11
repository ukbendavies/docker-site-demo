
Several stages are usually required to build new software and publish to a production environment; in this case the software is the documentation website you are reading right now! 

As a User I connect to an nginx webserver instance (running in a Container) that is going to serve a MkDocs website to a user agent (web browser, such as Chrome) that delivers this content payload so that we can read it.

!!! question "What are Containers useful for?"

    It is desirable to have a process where new software changes are promoted from a developers environment to production in a series of repeatable steps such that software is available with minimal time from initial change to production publication; Docker is one stack that can be used to perform this task with a number of supporting technology offerings at each stage throughout the deployment pipeline to help us achieve scale.

    Local Development  

    As a developer I would like to create software that I can run locally just like a mini-production environment so that code, deploy, debug loops are fast and my changes can be validated efficiently. I would then like the verified software changes deployed to production so that end users have the same or better experience.

    Continuous Integration (CI) phase  

    1. Artifacts such as a website, executables and so on are created and in this case a new MkDocs website is generated for this purpose.
    1. A Dockerfile is used to tell Docker how to build these artifacts into a Docker Image.
    1. Docker build uses the Dockerfile to generate a new Docker Image (a set file system differences (layers)). At this point it is possible to make a new container instance locally using the new image and the docker run command
    1. Finally the Docker image can be pushed to a Docker registry, for example Azure Container Registry (ACR), DockerHub, ...

    Continuous Delivery (CD) phase  

    Following on from CI, the CD phase is usually handed off to other systems to manage what can be fairly complex dance: deploying, canary deployments, performing rolling upgrades and rollbacks. Some examples include Microsoft VSTS and Spinnaker (this is not an extensive list and the landscape is changing rapidly). Phrases such as immutable, idempotent, repeatable and state-less become more important as services scale.

## Install Docker for the first time

Docker grew up on the Linux platform, however it is now possible to use Docker on Windows (Windows 10 and Windows Server).

!!! caution ""
    In my experience mileage varies and process isolation mode (container as a process) is only available on Windows Server however this poses other problems if you use Server GUI since the kernel is quite old and more recent Windows Server Core / Nano images are much smaller and have newer kernels but Docker requires a kernel level match in order to work.

    Microsoft has a good document that outlines the problem and provides a compatibility matrix with more recent OS.
    [Windows Container Version Compatibility](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility)

### Get Docker community-edition

This document focuses on Windows as this is the area of research I am interested in however (apart from occasional syntax) the commands, information and concepts are all cross-platform and will work equally well on Linux or Mac, installation process is one area of substantial difference however so it is suggested that the desired platform guidelines are followed.

[Get Docker community-edition](https://www.docker.com/community-edition)

!!! question "Validate Docker installation"

    Check that the installation has succeeded by running the ubiquitous hello-world

    ``` powershell
    docker run hello-world
    ```

    Check the Docker service configuration on Windows
  
    ``` powershell
    docker info
    ```

    Results in a blob of output, check for details that suggest the mode of operation is Linux, if this is configured correctly a mobyLinuxVM is created to host the linux containers using the Hyper-V hypervisor.

    ```
    Kernel Version: 4.9.93-linuxkit-aufs  
    Operating System: Docker for Windows  
    OSType: linux
    ```

## Install mkdocs environment

### Install python 3.5.4 for Windows

[Python for Windows](https://www.python.org/downloads/windows/)  /
[Python 3.5.4 for windows x64 installer](https://www.python.org/downloads/release/python-354/)

!!! TIP

    - Choose the windows 64-bit exe install option
    - Be sure to check the checkbox that adds python to path!

!!! NOTE "if python is already installed"
    double check the version of python at the time of creating this documentation 3.5.4 was the latest version that enabled mkdocs to work reliably.  
    ``` powershell
    python --version
    ```

### Install mkdocs tool chain

```
pip install mkdocs
```

## Create a new site

Create a few new markdown documents for a demo site, start with a home document usually this is index.md and maybe add a simple about page called about.md luckily mkdocs can generate a stub for you.

```
mkdocs new DemoDocs
```

!!! NOTE ""
    ```
    INFO    -  Creating project directory: DemoDocs
    INFO    -  Writing config file: DemoDocs\mkdocs.yml
    INFO    -  Writing initial docs: DemoDocs\docs\index.md
    ```

### Publish the new mkdocs site locally

```
cd .\DemoDocs

mkdocs serve
```

!!! NOTE ""
    ```
    INFO    -  Building documentation...
    INFO    -  Cleaning site directory
    [I 180702 22:41:06 server:292] Serving on http://127.0.0.1:8000
    [I 180702 22:41:06 handlers:59] Start watching changes
    [I 180702 22:41:06 handlers:61] Start detecting changes
    [I 180702 22:41:25 handlers:132] Browser Connected: http://localhost:8000/
    ```

!!! TIP
    The serve command usually launches the default browser; if this has not occurred navigate to the uri address above. Check the ports and in case of collisions configure mkdocs to serve on a different port e.g. `-a localhost:8090`

## Install a UI Theme

[View the mkdocs-material theme on GitHub](https://github.com/squidfunk/mkdocs-material)

```
pip install mkdocs-material
```

### Update the site configuration

Update the site configuration for mkdocs to render the new site with a new theme. MkDocs uses the yaml format for its configuration, find the section called theme and change this to material.

``` yaml
site_name: 'DemoDocs'
pages:
    - Home: index.md
    - About: about.md
theme: readthedocs
```

### Demo the results hosted locally

```
mkdocs serve
```

## Publish to a new Container

### PoC with a raw nginx webserver

[Visit the nginx project](https://docs.docker.com/samples/library/nginx)

```
docker run --detach --publish 80:80 --name webserver nginx
```

Open the nginx default website running in the running container
[http://localhost:80](http://localhost:80)

```
docker ps
```

!!! NOTE "results in container instance details"
    ```
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
    9149d927a911        nginx               "nginx -g 'daemon of"   6 minutes ago       Up 6 minutes        0.0.0.0:80->80/tcp   webserver
    ```

### Create a Dockerfile

!!! EXAMPLE "Requirements"

    - Use the latest nginx public image from [Docker Hub](https://hub.docker.com/)
    - Set working directory so that content can be created in the correct directory for nginx to discover the website entrypoint
    - Copy the contents from the mkdocs build artifacts: __site__ into the image working directory

The new Dockerfile that matches these requirements looks like this:

``` Dockerfile
FROM nginx
WORKINGDIR /usr/share/nginx/html
COPY site .
```

### Build the doc site and the new docker image

Execute mkdocs to build the new _site_ directory containing the content used for static publication. This uses the mkdocs.yml configuration that was defined earlier.

```
mkdocs build
```

### Build the Docker image

```
docker build --tag mkdocs:v1 .
```

As `docker build` executes, new docker image layer(s) are created that contain the changes described in the Dockerfile, almost every instruction creates a new image layer to contain each change.

!!! TIP
    Tags are used to apply and track change in new images and multiple tags can be added to a single image.

    tag `:latest` is used by various tools including Docker and Kubernetes to identify the most recent change. This is useful in continuous delivery process where it is desirable to deploy the latest changes without having to modify configuration files or wire through version details imperatively.

!!! INFO "List the new Docker image to see the results"

    ```
    docker image ls
    ```

    Results in:

    ```
    REPOSITORY TAG IMAGE ID CREATED SIZE
    docker-site-demo v1 fa8bbd0a2524 3 minutes ago 110MB
    ```

!!! NOTE
    Docker build is often referred to as 'bake' or 'baking' or a 'bake phase'

## Demo the Running the container

!!! fail
    todo: improve this section

To view the published site and show the same contents as we saw using `mkdocs serve` open a browser and navigate to the uri address of the container.

docker run --detach --name demo-site-instance -P 80:80 .

Now that the container is running, it is possible to see the process using `docker ps`
