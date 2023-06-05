# Part 3: Add a Proxy Server

Even though the static backend did not provide a very useful recipe we should adapt our application to accomodate for the users that would want to still use the old Backend. Since, as you probably noticed, the OpenAI backend is not the fastest to respond (takes around 20 seconds...), also the API key has limitations and might be used up.

In this final part, we will therefore extend our Docker Compose configuration to include both the static and the OpenAI backend services. To distribute traffic between the two backends we will add another service, a _Proxy Server_ to ensure higher application security.

## What is a Proxy Server

A proxy server acts as an intermediary between clients and servers, forwarding requests from clients to servers and returning responses back to the clients. It functions as a gateway, providing various benefits such as improved security, performance optimization, and caching.

Proxy servers have several benefitial use areas in rela world projects. Such as, load balancing and security:

- **Load Balancing**: Proxy servers can distribute incoming requests across multiple backend servers, balancing the workload and ensuring efficient utilization of resources. This helps to improve the scalability and availability of the application.

- **Security**: Proxy servers can act as a barrier between clients and servers, providing an additional layer of security. They can filter incoming requests, block malicious traffic, and enforce security policies, protecting the backend servers from potential attacks.

- **Other benefts/use areas**: Caching, anonymity and privacy.

## Balance traffic between Backends

First things first, we need to update our configuration to now include both backends. So, let's start with uncommenting the static backend in our `docker-compose.yml` file. Make sure to use different host ports for the two backends, i.e. they cannot both use port 8000 on your host computer. You could for instance assign port `8080` to the openAI backend.

Let's re-build and see what we are working with - `docker compose up --build`

As you probably guessed, clicking "_Get recipe_" retrives a response from the backend you allowed to keep the _8000_ port. We want the user to be able to choose which backend to use so lets start off by adding a button that fetches from the other backend.

### Task 3.1

To add a button we need to expand the code currently placed within the `App.tsx` file within our frontend (_/applications/frontend/App.tsx_). How you adapt the getRecipe function (either throguht props or by creating a copy) is up to you, but we need to make it so that the two buttons fetch data from one backend each.

<details>
<summary>✅ Solution</summary>
This task could be solved in different ways, so if you managed to get it working with two buttons that each requests their respective backends than you have succeeded.

But, if you would like to see one potential way of solving this we have shared our solution bellow.

```js
...

      <Button onClick={() => getRecipe("localhost", 8000)}>
      Get Recipe
      </Button>
      <Button onClick={() => getRecipe("localhost", 8080)}>
      Get Smart Recipe
      </Button>

...
```

</details>

Now you have managed to setup the frontend to make use of both of the containerized backends. Up until this point we have containerized three applications that all are exposed to your host computer through the port mappings you defined in your compose file.

To visualize this is how your applications communicate at this point:

![Application-structure-3.1](./../assets/images/application-structure-3_1.png)

<details>
<summary>For the curios ones 🙋‍♀️🙋‍♂️</summary>

If you study the Figure above, you might wonder why the backend is called from the WWW client, and not directly from the `frontend` container. This is because of the frontend framework we are using, React. React uses **client side rendering**. We do not need to worry about this now - but later in this workshop this will force us to solve our architecture a lil bit different. Wait and see for [Task 3.3](#task-33) and [Task 3.4](#task-34-update-frontend-to-reach-the-internal-backend-containers-using-nginx) 😏

</details>

---

As you can see our architecture is very reliant on communicating across our host computers network. This setup is all well and good for development for hosting your setup locally. However, in some cases some applications require higher security with least privilege principle when it comes to access. So, what if you did not want to expose your applications to your host computer but rather make them run seamlessly together and communicate within the multi-container orchestration? That's what we will do now with Docker `network` and `nginx`.

We will start by removing the ports that expose the backend outside of the docker environment. Currently we have configured mappings like this: `<host-port>:<container-port>`. If we remove the `<host-port>` part we expose only the container port to the compose orchestration, and not to your host computer.

### Task 3.2

Remove the the port outside of the compose network from your compose configuration. I.e. the ports that expose your applications to localhost. (Only remove host-port for the backends, keep the mapping for the frontend as we want to be able to still reach it from the browser.)

<details>

<summary>✅ Solution</summary>

```yml
---
python-backend:
  build:
    dockerfile: backend.dockerfile
    context: applications/backend/
  ports:
    - ":8000"
python-frontend:
  build:
    dockerfile: dockerfile
    context: applications/frontend/
  ports:
    - "3000:3000"
openapi-bakend:
  build:
    dockerfile: backend-openai.dockerfile
    context: applications/backend-openai/
  ports:
    - ":8080"
---
```

</details>

If you try running your compose setup now what happens? As you probably realized since you no longer expose any ports to your host computer you are not able to reach the backends through your browser. The frontend still tries to contact them on `localhost:8000/recipes` and `localhost:8080/recipes`, which are no longer exposed.

To visualize, this is what the current state of your setup looks like, where frontend points to now un-exposed ports:

![Application-structure-3.2](./../assets/images/application-structure-3_2.png)

Now that the ports are only exposed within the compose setup, why dont we try to see if we can make the containers communicate and reach eachother internally.

### Task 3.3

Try to reach the backend endpoint `/checkLiveness` from the terminal of your containerized frontend application using `curl`.

<details>
<summary>Hint 💡 - Not sure how to use curl? </summary>

With some Docker Compose _magic_, containers can communicate with eachother by using their _container names_ (or service names). By default, services in the same Docker Compose file are placed in the same network. In a basic Docker setup you would have to configure this network yourself - another perk of using Docker Compose.

For example, we can call the backend using `curl <container-name>:<container-internal-port>/checkLiveness`.

You can find all names of your running containers with this command

```
docker ps --format "{{.Names}}"
```

or simply by using the service name you chose when setting up your compose file.

</details>

<details>
<summary>✅ Solution</summary>
This can be achieved in two ways. Entering the terminal through the container in `Docker Desktop`, or entering the throgugh terminal commands.

- Enter the frontend through terminal:

  1.  Use `docker exec -it <container_id/conainer_name> sh`.
      - `docker exec` is used to execute a command inside a running container.
      - `-it` is a combination of two options. `-i` allows you to interact with the container by providing inout to the command being executed, and `-t` stands for _terminal_
      - `sh` is the command that will be executed inside the container. `sh` refers to the Unix shell.
  2.  Use curl to reach the `/checkliveness` endpoint.
      - Run `curl codepub-frontend:8000/checkLiveness`.

- Enter the frontend through `Docker Desktop``
  1. Open Docker Desktop. Locate and click on the container running your frontend.
  2. Click on the `terminal` tab and execurte step 2 above.

</details>

If you are familiar with using Docker you may wonder why this worked since we did not configure a network for the containers to communicat arcross. This is one more benefit of using _Docker Compose_, as it by default configures a network between containers in the same orchestration!

Now that we know they can reach eachother internally we need to also update the frontend call to reference the container name, as it is currently referencing `localhost`.

Open the `App.tsx` file and change the calls from `localhost` to `container-name` in the `getRecipe` input props in the button component.

You would think this should work without a problem since the frontend is within the docker network and we managed to access the backend from the terminal before - for some reason we now get "net::ERR_NAME_NOT_RESOLVED".
The reason for this, can be explained with the below image

![application-structure-3.3](./../assets/images/application-structure-3_3.png)

React does "client side rendering", meaning that the frontend webpage is running locally on your machine. It has no knowledge of any container names or network, since that only exists inside of Docker. *So although the frontend container is able to `curl` both backends successfully, the `getRecipe({port})` call is called "outside", and does not reach the containers*.

The webpage can only reach docker applications through ports exposed outside of Docker, like `localhost:3000`, not things referring to container names like `backend:8000`.

### Task 3.4 Update frontend to reach the internal backend containers using nginx

As you now have learned, frontend applications are facing problems accessing container references. This is because the actual webpage is hosted outside of the Docker environment, and therefore does not have any knowledge of the network and the container names that we used to `curl` between containers in the last step.

So, lets make the backends reachable without compromising too much on security. For this we will add a Proxy Server using **nginx**.

<details>
<summary>What is nginx? 🤔</summary>

`nginx` is a popular web server and reverse proxy server that excels at handling high concurrent connections and efficiently managing network traffic. It can be used as a reverse proxy to receive requests from clients and forward them to appropriate backend servers. This is what we will be using it for, to route requests to specific backends. When used as a proxy, `nginx` recieves request from your localhost client and acts as an intermediary towards the three containerized applications.

</details>

**a) Adding the nginx to the docker network:**

We want to add the nginx server as part of our docker network, so that it has access to the mapping we have done which allows us to reach the backend containers with their container names.
We have chosen to use one of Dockers premade image, `nginx:1.16.0-alpine`.

Try now to finish the configuration for the nginx container in the docker compose file by adding ports and network to it. We have added in the new parameters `image` for you - so now you simply need to add a fitting port mapping (choose whichever, but our solution has used the port `8003` for both external and internal).

<summary>Template</summary>

```yml
services:
  ...
  nginx:
    image: nginx:1.16.0-alpine
    ports:
      -
    networks:
      -
  ...
```

<details>
<summary>✅ Solution</summary>

```yml
version: "3"
services:
  ...
  nginx:
    image: nginx:1.16.0-alpine
    ports:
      - "8003:8003"
    networks:
      - mynet
  ...
```

</details>

**b) Remapping the HTTP request with nginx proxying:**
Now we want the frontend to be able to call an exposed url to reach the backend. To configure this, we'll create a file, `ngnix.conf` in the project root.

Let's start by adding a server that listens to port `8003`, and checks the liveness endpoint by adding a `location` and redirects traffic to the container with the simple backend (first backend we used). Below is a template you can use for the `nginx.conf` file:

```yml
server {
listen <INSERT_PORT_HERE>;

location /<INSERT_ENDPOINT_HERE> {
proxy_pass http://<CONTAINER_NAME>:<CONTAINER_INTERNAL_PORT>/recipes;
}
}
```

<details>
<summary>Hint 💡</summary>

The container name is `python-backend` and the relevant port (internal in the network) is `8000`

</details>

<details>
<summary>✅ Solution</summary>

```yml
server {
listen 8003;

location /recipes {
proxy_pass http://python-backend:8000/recipes;
}
}
```

</details>

**c) Add our nginx config to the container:**
Now, add this config file as part of the nginx container in the `docker-compose.yml`. This can be done by adding the file as part of the `volumes`.

A **volume** is a storage accessible for the container, which does not get deleted when the container shuts down, unlike everything else related to the container. In this example, we'll use a volume to add our proxy configuration file to the container.

Explanation of the `volumes` parameter in the docker-compose.yml file ,following this template:

```yml
volumes:
  - hostPath:containerPath:ro
```

- `hostPart` specifies which local file you want to be copied to the container - in your case that is the pathe to your `nginx.conf`file, i.e. `./nginx.conf`
- `containerPath` is the file on the container that the content will be copied/added to, we would like that to be `/etc/nginx/conf.d/default.conf`.
- `ro` means `read-only`. This part sets the access mode for the volume. `ro` means the container will have `read-only` access to the mounted volume.

<details>
<summary>✅ Solution</summary>

By this point your new `nginx` service configuration should look like the one below:

```yml
version: "3"
services:
  ...
  nginx:
    image: nginx:1.16.0-alpine
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    ports:
      - "8003:8003"
    networks:
      - mynet
  ...
```

</details>

Now, test if this remapping has solved our problem with not accessing backend from the frontend 🤓 We need one final step in our setup, namely to change which url the frontend calls. It should now be changed from `localhost:8000/recipes` to the url nginx now runs on.

<details>
<summary>Hint 💡</summary>

Nginx is running on `localhost:8003`, and the endpoint is the same. The frontend logic that needs changing is in `App.tsx`

</details>

**d) Add redirecting between two different frontends from the same server:**
Now we want to use this same localhost:8003 to redirect the traffic for the two different backends when the user clicks the two different "Get recipe" buttons in frontend. There is several ways to do this, and our solution has chosen to use `v1` and `v2` tags in the url to differentiate. Try to now finish the nginx.conf file.

Hint: you can duplicate the already existing proxy_pass we configured. The one already configured can now be renamed to `/v1/...`.

<details>
<summary>✅ Solution</summary>

```yml
server {
listen 8003;

location /v1/recipe {
proxy_pass http://python-backend:8000/recipe;
}

location /v2/recipe {
proxy_pass http://openapi-bakend:8080/recipe;
}
}
```

</details>

**e) Update the App.tsx call to the backend:** Now we can try to get the frontend to communicate with the backends again - now by going through the ngnix we've configured! The ngnix is exposed at `localhost:8003` - and we want to call the `/recipe` endpoint.

**[Add in solution - should we have the whole file?]**

Now try spinning up everything with `docker compose up --build` and click the two buttons.

This is how your final setup looks like.
![application-structure-3.4](./../assets/images/application-structure-3_4.png)

Congratulations! You have now learned about and compleated the Docker Compose workshop! We hope you learned something new and exciting, and had fun doing so!
