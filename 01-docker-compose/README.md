# Part 1: Docker Compose

We will start of the workshop by setting up the Frontend and the Static Backend using Docker Compose. Docker Compose allows us to define and manage multiple containers as a single application. The goal is to containerize and orchestrate these two services/applications, allowing them to communicate with eachother.

By the end of this step we will have a running cookbook application - displaying a static generic recipe.

## Without Docker Compose

Before we delve into the `docker-compose.yml` file lets first run our Backend and Frontend together as individual containers and see that they can communicate.

### Frontend

Lets move into the frontend folder and run `docker run build`.

### Backend

Now that you got the frontend up and running, lets do the same for the backend. Change directories into the backend folder and spin up the docker file there as well.

Are they both running? Nice! You should now be able to add ingredients and display the generic static recipe in the browser window!

## With Docker Compose

Wouldn't it be col if you only had to write **one** command to accomplish all of that. Oh wait, that is what we could use Docker Compose for, let's try it!

To start you off we have created a **`docker-compose.yml`** file for you to use. Located at the top of this repository.

Once you have found and opened it you should see a pretty empty configuration which we are now going to fill in. Lets start by giving our two services names. It's recommended to use naming convention that describes the container content, making it easy to understand and distinguish between different containerized applications.

<details>
<summary>Need a file-structure recap? </summary>
We have the following folder structure to work with, where the applications each have configured docker files in their respective root folders:

```
 root/
    docker-compose.yml
    applications/
        frontend/
        backend/
        backend-2.0/
```

</details>

### Task 1.1

Figure out the build configuration for the two services.

<details>
<summary>✅ Solution</summary>
For the frontend service the context and dockerfile should be:

```yml
build:
  dockerfile: backend.dockerfile
  context: applications/backend/
```

Similarly the backend build configuration should be:

```yml
build:
  dockerfile: dockerfile
  context: applications/frontend/
```

</details>

Now that the services have been added why dont we try and run our applications again, but now using only one command to spin up both?

Try running `docker compose up` from the root folder where the `docker-compose.yml` file is located.

Did it work? Probably not. Why is that? When we ran our applications individually we specified the port mappings between the container and our host comouter, this port mapping needs to be set in our confuguration.

### Task 1.2

Try adding port mappings to our services. Make them reachable form your host computer.

<details>
<summary>✅ Solution</summary>
For the frontend service the configuration should now look like this:

```yml
frontend:
  container_name: codepub-container-workshop-frontend
  build:
    dockerfile: dockerfile
    context: applications/frontend/
  ports:
    - "3000:3000"
```

Similarly the backend build configuration should be:

```yml
backend:
  container_name: codepub-container-workshop-backend
  build:
    dockerfile: backend.dockerfile
    context: applications/backend/
  ports:
    - "8000:8000"
```

</details>

Try running `docker compose up` one more time, can you now access the applications? Cool! Now you have successflly exposed the ports form docker and mapped them to your host computers network so you can reach them in your browser.

But, as myou may have noticed if you try fetching a recipe notheing happens...

Currently our two applications are running independently even if they belong to the same Docker Compose orchestration. We need to tell the containers how to communicate and reach eachother. This is done by setting up and connecting them through a network.

## Docker Networks

### Task 1.3

Add a network configuration and tell each application to utilize that network.

<details>
<summary>✅ Solution</summary>
After adding the network specifications and adding it to the two service configurations your Docker Compose file should looke something like this:

```yml
services:
  backend:
    container_name: codepub-container-workshop-backend
    build:
      dockerfile: backend.dockerfile
      context: applications/backend/
    ports:
      - "8000:8000"
    networks:
      - mynet
  frontend:
    container_name: codepub-container-workshop-frontend
    build:
      dockerfile: dockerfile
      context: applications/frontend/
    ports:
      - "3000:3000"
    networks:
      - mynet
networks:
  mynet:
    driver: bridge
    ipam:
      driver: default
```

</details>

Try running `docker compose up` one last time.

Voilà! We have now suceccsully used Docker Compose to containerize our two applications and configured them to communicate as a multi-container structure!

**TODO - refactor tasks and solutions**

Awesome! Now you have successfully set up our application using Docker Copmose. As you can see in the Docker Desktop UI you have now containerized and orchestrated multiple containers together.
