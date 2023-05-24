# Part 3: Add a Load Balancer

Even though the static backend did not provide a very useful recipe we should adapt our application to accomodate for the users that (for some unknown reason) would want to still use the old Backend.

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

 async function getRecipeSmart() {
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
<Button onClick={getRecipeSmart}>Get Smart Recipe</Button>

...
```

</details>

Now you have managed to setup the frontend to make use of both of the containerized backends. Up until this point we have containerized three apllications that all are exposed to your host computer through the port mappings you defined in your compose file. This setup is all well and good for development for hosting your setup locally. But in some cases some applications reequire higher security with least privilege principle when it comes to access.

So, what if you did not want to expose your applications to your host computer but rather make them run seamlessly together and communicate within the multi-container orhcestration?

To visualize this is how your applications communicate at this point:

**TODO add visual arcitecture of how everything communicates with localhost\***

As you can see it is very reliant on communicating across your host computers network. To make the containers communicate within the compose setup we need to adjust our current configurations.

### Task 3.2

Add a network to your compose file, and add that network to all applications. Network configurations follow this teplate:

```yml
networks:
  network-name: # Sets the name of the network. used as reference within the services.
  driver: # Specifies the network driver to use for the network. It determines how containers in the network communicate with each other.
```

Such a network can be added to a service by referncing the network name in the `networks` part of the service which we would need to add. In the same manner as you did with ports.

### Task 3.3

Add a network you can apply to your applications into your current configuration.

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

**TODO add nginx part with description and tasks **

Congratulations! You have now learned about and compleated the Docker Compose workshop! We hope you learned something new ansdexiting, and had fun doing so!
