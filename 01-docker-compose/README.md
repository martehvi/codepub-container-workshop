# Part 1: Docker Compose

We will start of the workshop by setting up the Frontend and the Static Backend using Docker Compose. Docker Compose allows us to define and manage multiple containers as a single application. The goal is to containerize and orchestrate these two services/applications, allowing them to communicate with eachother.

By the end of this step we will have a running cookbook application - displaying a static generic recipe.

## Without Docker Compose

Before we delve into the `docker-compose.yml` file let's first run our Backend and Frontend together as individual containers and see that they can communicate.

### Frontend

Let's move into the frontend folder - `cd applications/frontend/`

1. Start off with building a docker image by running: `docker build -t <image-tag-name> -f <docker-filename> .`
   - The `-t` flag provides the image with a tag which is essentially a name for the image, here you need to specify an appropriate image name such as `-t frontend`.
   - The `.` in the end describes the path to where Docker Engine should find the dockerfile to build the image upon.
   - The `-f` is used to reference the dockerfile name used in the build. This flag is needed when naming the file anything other than the default `dockerfile` value.
2. Next, let's run the image we just built by using: `docker run -p 3000:3000 -t <image-tag-name>`
   - The `-p` flag exposes a port on your local machine and maps it to a port on the docker container. The mapping uses the format, `<host-port>:<container-port>`.

<dispaly>
<summary>

Hint 🔍 - What is _&lt;image-tag-name&gt;_ and _&lt;docker-filename&gt;_ ?

</summary>

- _&lt;image-tag-name&gt;_: This is the desired name or tag you want to assign to your Docker image. Choose a meaningful and descriptive name to easily identify the image. If you do not provide this then you will need the _IMAGE ID_ in your `docker run` command. You can find out what your image id or tag value is by running `docker images`. If you did not specify a value the _TAG_ column will have the _none_ value. So, when you then in the second command, `docker run` need to refer to the image you can either use the tag you provided when creating the image or the _IMAGE ID_ (tip: you only need a uniqe part of the image id prefix with minimum two character length).

- _&lt;docker-filename&gt;_: This refers to the filename of the Dockerfile you want to use for building the image. Specify the name of the Dockerfile or its path if it is in a different location. For the _frontend_ you can identify this file in the repository directory in your IDE in the frontend folder, we have named the file `dockerfile`.

  </display>

### Backend

Now that you got the frontend up and running, let's do the same for the backend. Change directories into the backend folder (`cd ../backend/`) and spin up the dockerfile there as well.

1. Start off with building a docker image by running: `docker build -t <image-tag-name> -f <docker-filename> .`
2. Next let's run the image we just built by using: `docker run -p 8000:8000 -t <image-tag-name>`

> NB: the _docker-filname_ for your backend is not using the default dockerfile naming so this you must locate in the backend folder and specify behind the filename flag, `-f` .

Are they both running? Nice! You should now be able to add ingredients and display the generic static recipe in the browser window through `localhost:3000` where we are hosting our frontend!

> **NB**: Remember to _kill off any running containers_ before continuing. The containers will run until they are manually shutdown. You can manually shut down your running frontend and backend by using the `ctrl+C` in the running treminal or stopping them in using the stop button in Docker Desktop.

## With Docker Compose

Wouldn't it be cool if you only had to write **one** command to accomplish all of that? That's what we could use Docker Compose for, let's try it!

To start you off, we have created a **`docker-compose.yml`** file for you to use. It's located at the root of this repository.

Once you have found and opened it you should see a pretty empty configuration which we are now going to fill in. Let's start by giving our two services names. It's recommended to use a naming convention that describes the container content or purpose, making it easy to understand and distinguish between different containerized applications.

You can add a service using the following template:

```yml
services:
  <insert-service-name-here>:
    build:
      dockerfile: # (optional) must be set if the dockerfile is given a different value than the default name 'Dockerfile'.
      context: # Specifies the path to the directory containing the Dockerfile and the build context.
```

### Task 1.1

Figure out the build configuration for the two services. 

<details>
<summary>Need a file-structure recap? </summary>
We have the following folder structure to work with, where the applications each have configured docker files in their respective root folders:

```
 root/
    docker-compose.yml
    applications/
        frontend/
        backend/
```

</details>

<details>
<summary>✅ Solution</summary>
For the frontend service the context and dockerfile should be:

```yml
codepub-frontend:
  build:
    dockerfile: dockerfile
    context: applications/frontend/
```

Similarly the backend build configuration should be:

```yml
codepub-backend:
  build:
    dockerfile: backend.dockerfile
    context: applications/backend/
```

</details>

Now that the services have been added why dont we try and run our applications again, but now using only one command to spin up both?

Try running `docker compose up` from the root folder where the `docker-compose.yml` file is located.

Did it work? If you tried to check `localhost:3000` without luck than maybe you realized that we did not specify any port mappings in our command just now. When we ran our applications individually we specified the port mappings between the container and our host computer, this port mapping needs to be added in our confuguration if we want to reach the applications from localhost.

### Task 1.2

Try adding port mappings to our services. Make them reachable from your host computer. Just as for `build`, docker compose services have a `ports` section where we can configure such a mapping. As before here is a template:

```yml
<insert-service-name-here>:
  ...
  ports:
    - <host-port>:<container-port>
    ...
```

<details>
<summary>✅ Solution</summary>

At the end of this task you should have a `docker-compose.yml` file that looks like this:

```yml
version: "3"
services:
  codepub-frontend:
    build:
      dockerfile: dockerfile
      context: applications/frontend/
    ports:
      - "3000:3000"
  codepub-backend:
    build:
      dockerfile: backend.dockerfile
      context: applications/backend/
    ports:
      - "8000:8000"
```

</details>

Try running `docker compose up --build` this time (_adding the --build flag to ensure that we re-build our docker images_), can you now access the applications? Nice! Now you have successflly exposed the ports and mapped them to your host computer so you can reach them in your browser.

Now you have successfully set up your applications using Docker Compose. As you can see in the Docker Desktop UI, you have now containerized and orchestrated multiple containers together.

Let's move into **[Part 2](../02-replace-backend/README.md)**, where we will replace our static backend with a smart one. 😉
