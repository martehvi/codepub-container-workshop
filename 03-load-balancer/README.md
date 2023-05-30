# Part 3: Add a Load Balancer

Even though the static backend did not provide a very useful recipe we should adapt our application to accomodate for the users that would want to still use the old Backend. Since, as you probably noticed, the OpenAI backend is not the fastest to respond (takes around 20 seconds...), also the API key has limitations and might be used up.

In this final task, we will therefore extend our Docker Compose configuration to include both the static and the OpenAI backend services. To distribute traffic between the two backends we will add another service, a _Proxy Server_.

## What is a Proxy Server

**TODO add a brief description of what it is**

## Balance traffic between Backends

Without further ado let's add a **Proxy Server** to our multi-container setup!

First things first, we need to update out configuration to now include both backends. So, let's start with uncommenting the static backend in our `docker-compose.yml` file. Make sure to use different host ports for the two backends, i.e. they cannot both use port 8000 on your host computer. You could for instance assign port `8080` to the openAI backend.

Let's re-build and see what we are working with - `docker compose up --build`

As you probably guessed, clicking "_Get recipe_" retrives a response from the backend you allowed to keep the 8000 port. We want the user to be able to choose which backend to use so lets start off by adding a button that fetches from the other backend.

### Task 3.1

To add a button we need to expand the code currently placed within the `App.tsx` file within our frontend (_/applications/frontend/App.tsx_). How you adapt the getRecipe function (either throguht props or by creating a copy) is up to you, but we need to make it so that the two buttons fetch data from one backend each.

<details>
<summary>✅ Solution</summary>
This task could be solved in different ways, so if you managed to get it working with two buttons that each requests their respective backends than you have succeeded.

But, if you would like to see one potential way of solving this we have shared our solution bellow.

```js
...

 async function getRecipe2() {
    setLoading(true);
    const requestBody = JSON.stringify({
      ingredients: ingredients,
    });
    await fetch("http://localhost:8080/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) => setRecipe(data))
      .finally(() => setLoading(false));
  }

...

<Button onClick={getRecipe}>Get Recipe</Button>
<Button onClick={getRecipe2}>Get Smart Recipe</Button>

...
```

</details>

Now you have managed to setup the frontend to make use of both of the containerized backends. Up until this point we have containerized three apllications that all are exposed to your host computer through the port mappings you defined in your compose file. This setup is all well and good for development for hosting your setup locally. But in some cases some applications require higher security with least privilege principle when it comes to access.

So, what if you did not want to expose your applications to your host computer but rather make them run seamlessly together and communicate within the multi-container orchestration?

To visualize this is how your applications communicate at this point:

**TODO add visual arcitecture of how everything communicates with localhost\***

As you can see it is very reliant on communicating across your host computers network. To make the containers communicate within the compose setup we need to adjust our current configurations. We will start by removing the ports that expose the backend outside of the docker environment, and adding a network between our containers to make it possible for internal communication between the containers.

Currently we have configured mappings like this: `<host-port>:<container-port>`. If we remove the `<host-port>` part we only expose the container port to the compose orchestration, and not to your host computer.

### Task 3.2

Remove the the port outside of the compose network from your compose configuration. I.e. the ports that expose your applications to localhost.

<details>
<summary>✅ Soulution</summary>

```yml
---
python-backend:
  container_name: codepub-container-workshop-react-backend
  build:
    dockerfile: backend.dockerfile
    context: applications/backend/
  ports:
    - ":8000"
  networks:
    - mynet
python-frontend:
  container_name: codepub-container-workshop-react-frontend
  build:
    dockerfile: dockerfile
    context: applications/frontend/
  ports:
    - ":3000"
  networks:
    - mynet
openapi-bakend:
  container_name: codepub-container-workshop-openai-backend
  build:
    dockerfile: backend-openai.dockerfile
    context: applications/backend-openai/
  ports:
    - ":8080"
  networks:
    - mynet
---
```

</details>


Now test that you are not able to access the backend containers from the outside anymore (`localhost:8000`)- the frontend will load forever since it cannot access the backend with the previously working localhost call.

### Task 3.3

Add a network to your compose file, and add that network to all applications. Network configurations follow this template:

```yml
networks:
  network-name: # Sets the name of the network. Used as reference within the services.
    driver: # Specifies the network driver to use for the network. It determines how containers in the network communicate with each other.
```

Such a network can be added to a service by referncing the network-name in the `networks` part of the service. You can do this in the same manner as you did with ports.

<details>
<summary>✅ Solution</summary>

```yml
version: "3"
services:
  python-backend:
    container_name: codepub-container-workshop-react-backend
    build:
      dockerfile: backend.dockerfile
      context: applications/backend/
    ports:
      - "8000:8000"
    networks:
      - mynet
  python-frontend:
    container_name: codepub-container-workshop-react-frontend
    build:
      dockerfile: dockerfile
      context: applications/frontend/
    ports:
      - "3000:3000"
    networks:
      - mynet
  openapi-bakend:
    container_name: codepub-container-workshop-openai-backend
    build:
      dockerfile: backend-openai.dockerfile
      context: applications/backend-openai/
    ports:
      - "8080:8080"
    networks:
      - mynet

networks:
  mynet:
    driver: bridge
```

</details>

To verify that the applications can reach eachother you can enter the terminal within the frontend application's container and try to ping the backend, with for example `curl {backend-container-name}:{internal-backend-port}/checkLiveness`.

Now test what happens if you try to use this same logic to update the `App.tsx` call to the backend with this container name reference. You would think this should work without a problem since the frontend is within the docker network and we managed to access the backend from the terminal before - for some reason we now get "net::ERR_NAME_NOT_RESOLVED". 
The reason for this, can be explained with the below image  

### Task 3.4 Update frontend to reach the internal backend containers using nginx
As you now have learned, frontend applications are facing problems accessing container references. This is because the actual webpage is hosted outside of the Docker environment, and therefore does not have any knowledge of the network and the container names that we used to `curl` between containers in the last step. 

So, lets make the reachable without compromising too much on security. For this we will add a Proxy Server using **nginx**.

(*Theory*:)
Nginx is a HTTP proxyer, and does exactly that - forwards a request that is sent to the nginx server to whichever server/endpoint wanted. In our case where we have closed off all external entrances to the backend, and nginx can be used as our entrance to these backends, without us actually having to know anything about where the backends are hosted. 

**Adding the nginx to the docker network:**
We want to add the nginx server as part of our docker network, so that it has access to the mapping we have done which allows us to reach the backend containers with their container names. 
We have chosen to use one of **Dockers** premade `images`, `nginx:1.16.0-alpine`.

Try now to finish the configuration for the nginx container in the docker compose file by adding ports and network to it. We have added in the new parameters `image` for you - so now you simply need to add a fitting port mapping (choose whichever, but our solution has used the port `8003` for both external and internal). 

*[Question to myself]: would it be smart to make them figure out the "nginx.conf" referencing themselves?*

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

**Remapping the HTTP request with nginx proxying:**
Now we want the frontend to be able to call an exposed url to reach the backend. To configure this, we'll create a file, `ngnix.conf`. Let's add a server that listens to port `8003`, and checks the liveness endpoint by addin a `location` and redirects traffic to the container with the simple backend (first backend we used). Below is a template you can use for the `nginx.conf` file:


```yml
server {
  listen <INSERT_PORT_HERE>;

  location /<INSERT_ENDPOINT_HERE> {
    proxy_pass http://<CONTAINER_NAME>:<CONTAINER_INTERNAL_PORT>/checkLiveness
  }
}
```

<details>
<summary>Hint 💡</summary>

The container name is `codepub-container-workshop-react-backend` and the relevant port (internal in the network) is `8000`
</details>

<details>
<summary>✅ Solution</summary>

```yml
server {
  listen 8003;

  location /recipes {
    proxy_pass http://codepub-container-workshop-react-backend:8000/recipes
  }
}
```
</details>

Now also add this config file as part of the nginx container in the `docker-compose.yml`. This can be done by adding the file as part of the `volumes`.

A **volume** is a storage accessible for the container, which does not get deleted when the container shuts down, unlike everything else related to the container. In this example, we'll use a volume to add our proxy configuration file to the container. 

Explanation of the `volumes` parameter in the docker-compose.yml file: 
- first part (before `:`) `./nginx.conf` is which local file you want to be copied to the container
- second part, `/etc/nginx/conf.d/default.conf`, is the file on the container that the content will be copied/added to.
- third part, `ro` means `read-only` after the file has been mounted


<details>
<summary>✅ Solution</summary>

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

Nginx is running on `localhost:8003`, and th
</details>

**Add redirecting between two different frontends from the same server:**
Now we want to use this same localhost:8003 to redirect the traffic for the two different backends when the user clicks the two different "Get recipe" buttons in frontend. There is several ways to do this, and our solution has chosen to use `v1` and `v2` tags in the url to differentiate. Try to now finish the nginx.conf file.  

Hint: you can duplicate the already existing proxy_pass we configured. The one already configured can now be renamed to `/v1/...`.

<details>
<summary>✅ Solution</summary>

```yml
server {
  listen 8003;

  location /v1/recipe {
    proxy_pass http://codepub-container-workshop-react-backend:8000/recipe
  }

  location /v2/recipe {
    proxy_pass http://codepub-container-workshop-openai-backend:8080/recipe
  }
}
```
</details>

**Update the App.tsx call to the backend:** Now we can try to get the frontend to communicate with the backends again - now by going through the ngnix we've configured! The ngnix is exposed at `localhost:8003` - and we want to call the `/recipe` endpoint. 

**[Add in solution - should we have the whole file?]**

Now try spinning up everything with `docker compose up --build` and click the two buttons.

--

Congratulations! You have now learned about and compleated the Docker Compose workshop! We hope you learned something new and exciting, and had fun doing so!
