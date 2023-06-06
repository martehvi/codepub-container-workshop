# Part 2: Replace Backend

Now let's take our application to the next level! Currently (_as you probably noticed_) the recipe is the same regardless of what ingedients we enter. So, this next part will involve replacing the static backend with a dynamic one based upon OpenAI technology! By leveraging OpenAI the new backend will generate dynamic recipes based on the ingredient input!

Don't worry, the backend for this already exists. But there is a few things we need to do in order to make use of it.

## Run Backend Locally

Some of you may have noticed the `assets` folder we have given you. Here you will find the `backend-openai` application. Before we start adding the new backend to our multi-container setup lets ensure that we are able to run it locally first.

Our new backend depend on some environment variables that we need to configure. So, start off by moving into the `assets/backend-openai` folder and add the missing environment variable in the `.env`-file.

Once you have the this in place, let's try to run the application locally. Move into the `assets/backend-openai` folder in your terminal and run the following commands:

```bash
npm install
npm start
```

Did it work? Cool! Now let's containerize it.

### Task 2.1

Create a `dockerfile` for the _backend-openai_ application. Fill in the necessary contents.

> **Hint**:
> You can copy the dockerfile for the static backend and reuse its content.

<details>
<summary>Solution ✅</summary>
Your file should now look like this:

```docker

FROM node:16-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN npm install

EXPOSE 8000

CMD [ "npm", "start" ]

```

</details>

To comply with the existing code structure, let's move the folder containing the new backend into our applications folder.

```shell
mv assets/backend-openai applications # Execute from repository root
```

## Add the new Backend to Docker Compose

Now that the new application is located where we want it, let's update our services in the compose file.

Let's start by commenting out the old backend service (_Tip: Don't erase it! It might come in handy later on..._).

Starting out with a new empty service shell, we need to add the build configuration as we just did for the two first services.

### Task 2.2

Create a new service in the Docker Compose file for our new backend. Remember to add port a mapping to localhost.

<details>
<summary>✅ Solution</summary>
The new service configuration should look something like this:

```yml
backend-openai:
  build:
    dockerfile: backend-openai.dockerfile
    context: applications/backend-openai/
  ports:
    - "8000:8000"
```

</details>

Having now added the new backend to your Compose setup, try running `docker-compose up --build` and try fetching a recipe! _**NOTE:** This might take up to 20 seconds as the new backend relies on OpenAI, which is not the fastest at generating responses...._

Wow, look at that! The recipies you receive are now actually relevant and useful for the input ingredients.
Now, for the final part we will use all three applications and even add a fourth service! Lets dive into **[Part 3](../03-proxy-server/README.md)**.
