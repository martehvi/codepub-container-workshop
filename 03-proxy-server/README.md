# Part 3: Include both backends using a Proxy Server

Even though the static backend did not provide a very useful recipe we
should adapt our application to accomodate for the users that would
want to still use the old backend. Since, as you probably noticed, the
OpenAI backend is not the fastest to respond (takes around 20
seconds...), also the API key has limitations and might be used up.

### Task 3.1: Add new backend to docker-compose

First things first, we need to update our configuration to now include both backends. So, let's start with uncommenting
the static backend in our `docker-compose.yml` file. Make sure to use different host ports for the two backends, i.e.
they cannot both use port 8000 on your host computer. You could for instance assign port `8080` to the openAI backend.

<details>
<summary>✅ Solution</summary>

This is how the `docker-compose.yml` file would look now

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
  openai-backend:
    build:
      dockerfile: backend-openai.dockerfile
      context: applications/backend-openai/
    ports:
      - "8080:8080"

```

</details>

Let's re-build and see what we are working with

```shell
docker compose up --build
```

> We use `--build` to trigger a rebuilding of the images in the dockerfile since we have now modified the code inside
> the image.

As you probably guessed, clicking "_Get recipe_" retrieves a response
from the backend version you let keep the _8000_ port because this is the port
used by the frontend code running inside the docker container. We want
the user
to be able to choose which backend to use so let's start off by adding
a button that fetches from the other backend.

### Task 3.2: Add a button for each backend

To add a button we need to expand the code currently placed within
the `App.tsx` file within our frontend (_/applications/frontend/src/App.tsx_). How you adapt the getRecipe
function (either through props or by creating a copy) is up to you,
but we need to make it so that the two buttons fetch data from one
backend each.

<details>
<summary>✅ Solution</summary>
This task could be solved in different ways, so if you managed to get it working with two buttons that each requests their respective backends than you have succeeded.

But, if you would like to see one potential way of solving this we
have shared our solution bellow.

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

Now you have managed to setup the frontend to make use of both of the
containerized backends. Up until this point we have containerized
three applications that all are exposed to your host computer through
the port mappings you defined in your compose file.

To visualize, this is how your applications communicate at this point:

![Application-structure-3.1](./../assets/images/application-structure-3_1.PNG)

<details>
<summary>For the curious ones 🙋‍♀️🙋‍♂️</summary>

If you study the Figure above, you might wonder why the backend is called from the WWW client, and not directly from
the `frontend` container. This is because of the frontend framework we are using, React. React uses **client side
rendering**. We do not need to worry about this now - but later in this workshop this will force us to solve our
architecture a lil bit different. Wait and see for [Task 3.3](#task-33-test-out-multi-container-communication)
and [Task 3.4](#task-34-update-frontend-to-reach-the-internal-backend-containers-using-nginx) 😏

</details>

---

As you can see our architecture is very reliant on communicating
across our host computers network. Now we want to set up a more secure architecture, by removing the external ports from
both backends. This follows the "least privileges" principle, and will force us to access the backends within the docker
network.

We will start by removing the ports that expose the backend outside of
the docker environment. Currently we have configured mappings like
this: `<host-port>:<container-port>`. If we remove the `<host-port>`
part we expose only the container port to the compose orchestration,
and not to your host computer.

### Task 3.3: Remove external ports in both backends

Remove the port outside of the compose network from your compose
configuration. I.e. the ports that expose your applications to
localhost. (Only remove host-port for the backends, keep the mapping
for the frontend as we want to be able to still reach it from the
browser.)

<details>

<summary>✅ Solution</summary>

```yml
---
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
    - ":8000"
openai-backend:
  build:
    dockerfile: backend-openai.dockerfile
    context: applications/backend-openai/
  ports:
    - ":8080"
---
```

</details>

If you try running your compose setup now what happens? As you
probably realized since you no longer expose any ports to your host
computer you are not able to reach the backends through your browser.
The frontend still tries to contact them on `localhost:8000/recipes`
and `localhost:8080/recipes`, which are no longer exposed.

To visualize, this is what the current state of your setup looks like, where frontend points to now un-exposed ports:

![Application-structure-3.2](./../assets/images/application-structure-3_2.PNG)

Now that the ports are only exposed within the compose setup, why dont
we try to see if we can make the containers communicate and reach
each other internally.

### Task 3.4: Test out multi-container communication

Try to reach the backend endpoint `/checkLiveness` from the terminal of your containerized frontend application
using `curl`.

<details>
<summary>Hint 💡 - Not sure how to use curl? </summary>

With some Docker Compose _magic_, containers can communicate with eachother by using their _container names_ (or service
names). By default, services in the same Docker Compose file are placed in the same network. In a basic Docker setup you
would have to configure this network yourself - another perk of using Docker Compose.

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
    1. Use `docker exec -it <container_id/conainer_name> sh`.
        - `docker exec` is used to execute a command inside a running container.
        - `-it` is a combination of two options. `-i` allows you to interact with the container by providing inout to
          the command being executed, and `-t` stands for _terminal_
        - `sh` is the command that will be executed inside the container. `sh` refers to the Unix shell.
    2. Use curl to reach the `/checkliveness` endpoint.
        - Run `curl codepub-backend:8000/checkLiveness`.

- Enter the frontend through `Docker Desktop`
    1. Open Docker Desktop. Locate and click on the container running your frontend.
    2. Click on the `terminal` tab and execute step 2 above.

</details>

If you are familiar with using Docker you may wonder why this worked since we did not configure a network for the
containers to communicate across. This is one more benefit of using _Docker Compose_, as it by default configures a
network between containers in the same orchestration!

Now that we know they can reach each other internally we need to also update the frontend call to reference the
container name, as it is currently referencing `localhost`.

Open the `App.tsx` file and change the calls from `localhost` to `container-name` in the `getRecipe` input props in the
button component.

<details>
<summary>✅ Solution</summary>

```js
...

<Button onClick={() => getRecipe("codepub-backend", 8000)}>
    Get Recipe
</Button>
<Button onClick={() => getRecipe("backend-openai", 8080)}>
    Get Smart Recipe
</Button>

...
```

</details>

You would think this should work without a problem since the frontend
is within the docker network and we managed to access the backend from
the terminal before - for some reason we now get "net::
ERR_NAME_NOT_RESOLVED".
The reason for this, can be explained with the below image

![application-structure-3.3](./../assets/images/application-structure-3_3.PNG)

React does "client side rendering", meaning that the frontend webpage is running locally on your machine. It has no
knowledge of any container names or network, since that only exists inside of Docker. _So although the frontend
container is able to `curl` both backends successfully, the `getRecipe({port})` call is called "outside", and does not
reach the containers_.

The webpage can only reach docker applications through ports exposed outside of Docker, like `localhost:3000`, not
things referring to container names like `backend:8000`.

### Task 3.5 Update frontend to reach the internal backend containers using nginx

As you now have learned, frontend applications are facing problems accessing container references. So, let's make the
backends without using localhost. To access the two backends we will add another service, a _Proxy Server_ called nginx.

<details>
<summary>What is Proxy Server and nginx? 🤔</summary>

### Proxy Server

A proxy server acts as an intermediary between clients and servers, forwarding requests from clients to servers and
returning responses back to the clients. It functions as a gateway, providing various benefits such as improved
security, performance optimization, and caching.

Proxy servers have several beneficial use areas in real world projects. Such as, load balancing and security:

- **Load Balancing**: Proxy servers can distribute incoming requests across multiple backend servers, balancing the
  workload and ensuring efficient utilization of resources. This helps to improve the scalability and availability of
  the application.

- **Security**: Proxy servers can act as a barrier between clients and servers, providing an additional layer of
  security. They can filter incoming requests, block malicious traffic, and enforce security policies, protecting the
  backend servers from potential attacks.

- **Other benefits/use areas**: Caching, anonymity and privacy.

### Nginx

`nginx` is a type of proxy server, and excels at handling high concurrent connections and efficiently managing network
traffic. It can be used as a reverse proxy to receive requests from clients and forward them to appropriate backend
servers. This is what we will be using it for, to route requests to specific backends. When used as a proxy, `nginx`
receives request from your localhost client and acts as an intermediary towards the three containerized applications.

</details>

**a) Adding the nginx to the docker network:**

We want to add the nginx server as part of our docker network, so that
it has access to the mapping we have done which allows us to reach the
backend containers with their container names.
We have chosen to use one of Dockers pre-made
image, `nginx:1.16.0-alpine`.

Try now to finish the configuration for the nginx container in the
docker compose file by adding ports. We have added
in the new parameters `image` for you - so now you simply need to add
a fitting port mapping (choose whichever, but our solution has used
the port `8003` for both external and internal).

<summary>Template</summary>

```yml
services:
  ...
  nginx:
    image: nginx:1.16.0-alpine
    ports:
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
  ...
```

</details>

**b) Remapping the HTTP request with nginx proxying:**

Now we want the frontend to be able to call an exposed url to reach
the backend. To configure this, we'll create a file, `ngnix.conf`, in
the project root.

Let's start by adding a server that listens to port `8003`, and checks
the endpoint by adding a `location` and redirects traffic to
the container with the simple backend (first backend we used). Below
is a template you can use for the `nginx.conf` file:

```yml
server {
  listen <INSERT_PORT_HERE>;

  location /<INSERT_ENDPOINT_HERE> {
  proxy_pass http://<CONTAINER_NAME>:<CONTAINER_INTERNAL_PORT>/<INSERT_ENDPOINT_HERE>;
  }
}
```

<details>
<summary>Hint 💡</summary>

The container name is `codepub-backend` and the relevant port (internal
in the network) is `8000`.

To test if the redirection works easily you can use the endpoint `checkLiveness`. For the actual implementation, the
redirection should point to the endpoint `recipes` used earlier.

</details>

<details>
<summary>✅ Solution</summary>

```yml
server {
  listen 8003;

  location /recipes {
  proxy_pass http://codepub-backend:8000/recipes;
  }
}
```

</details>

**c) Add our nginx config to the container:**
Now, add this config file as part of the nginx container in
the `docker-compose.yml`. This can be done by adding the file as part
of the `volumes`.

A **volume** is a storage accessible for the container, which does not
get deleted when the container shuts down, unlike everything else
related to the container. In this example, we'll use a volume to add
our proxy configuration file to the container.

Explanation of the `volumes` parameter in the docker-compose.yml file, following this template:

```yml
volumes:
  - hostPath:containerPath:ro
```

- `hostPart` specifies which local file you want to copy to the container - in your case that is the path to
  your `nginx.conf` file, i.e. `./nginx.conf`
- `containerPath` is the file on the container that the content will be copied/added to, we would like that to
  be `/etc/nginx/conf.d/default.conf`.
- `ro` sets the access mode for the volume. `ro` means the container will have `read-only` access to the mounted volume.

<details>
<summary>✅ Solution</summary>

By this point your new `nginx` service configuration should look like
the one below:

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
  ...
```

</details>

Now, test if this remapping has solved our problem with not accessing
backend from the frontend 🤓 Change which url the frontend calls when clicking "Get Recipe". It should now be
changed from `localhost:8000/recipes` to the url nginx now runs on.

<details>
<summary>✅ Solution</summary>

```js
...

<Button onClick={() => getRecipe("localhost", 8003)}>
    Get Recipe
</Button>

...
```

</details>

Now you should successfully see the "Recipe 101" displayed in the frontend - we've got contact again! 🎉

**d) Add redirecting between two different frontends from the same server:**
Now we want to use this same `localhost:8003` to redirect the traffic for the two different backends when the user
clicks the two different recipe buttons in frontend. There are several ways to do this, and our solution has chosen to
use `v1` and `v2` tags in the url to differentiate. Try to now finish the `nginx.conf` file.

> Hint: You can duplicate the already existing proxy_pass we configured. The one already configured can now be renamed
> to `/v1/...`.

<details>
<summary>✅ Solution</summary>

```yml
server {
  listen 8003;

  location /v1/recipes {
  proxy_pass http://codepub-backend:8000/recipes;
  }

  location /v2/recipes {
  proxy_pass http://openai-backend:8080/recipes;
  }
}
```

</details>

**e) Update the App.tsx call to the backend:** Now we can try to get
the frontend to communicate with the backends again - now by going
through the nginx we've configured! The nginx is exposed
at `localhost:8003` - and we want to call the `/recipe` endpoint for the two backend versions. We pointed at in
the `nginx.conf` in the previous task.

> Hint: You need to extend your `getRecipe()`-function implementation and function-calls to make use of the
> optional `version`-prop.
>
> Here you need to update the url where we fetch from the `/recipes` endpoint. Add the version prop to the correct
> location in the url like this - `/${version}/recipes`

<details>

<summary>✅ Solution</summary>
Your api call should now include the version prop and the Button components should include extended function calls that make use of the optional `version`-property, and look like this:

```js
...
await fetch(`http://${ipAddress}:${port}/${version}/recipes`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: requestBody,
})

...
<Button onClick={() => getRecipe("localhost", 8003, "v1")}>
    Get Recipe
</Button>
<Button onClick={() => getRecipe("localhost", 8003, "v2")}>
    Get Smart Recipe
</Button>
...

```

</details>

Now try spinning up everything with

```shell
docker compose up --build
```

and click the two buttons. Our cookbook is working perfectly again - and the frontend has no clue where the backend
runs! 🤯

This is how your final setup looks like.

![application-structure-3.4](./../assets/images/application-structure-3_4.PNG)

Congratulations! You have now learned about and completed the Docker Compose workshop! We hope you learned something new
and exciting, and had fun doing so! 😎
