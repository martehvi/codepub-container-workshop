# Part 2: Replace Backend

Now let's take our application to the next level! Currently (_as you probably noticed_) the recipie is the same regardless of what ingedients we enter. So, this next part will involve replacing the static backend with a dynamic one based upon OpenAI technology! By leveraging OpenAI the new backend will generate dynamic recipes based on the ingredient input!

Dont worry, the backend for this already exists. But there is a few things we need to do in order to make use of it.

## Run Backend Locally

Some of you may have noticed the `assets` folder we have given you. Here you will find the `backend-openai` application. Before we start adding the new backend to our multi-container setup lets ensure that we are able to run it locally first.

Our new backend depend on some environment values that we need to configure. So, start off by moving into the `assets` folder and create a new `.env` file.

```shell
echo > assets/backend-openai/.env
```

Open the file and enter the following content:

```env
PORT=...
API_KEY=...
```

### Task 2.1

Identify the port that the new backend will run on inside its container.

<details>
<summary>✅ Solution</summary>
If you managed to locate the docker file you should there be able to see the exposed port.

<details>
<summary>Did you not find it? </summary>
Here it is:

```docker
EXPOSE 8080
```

</details>

</details>
As for the API key ask one of us when you have come this far and we will give it to you!

Once you have the environment variables in place, lets try to run the application locally. Move into the `assets/backend-openai` folder and run the following commands:

```bash
npm install
npm start
```

Did it work? Cool! Now lets containerize it.

### Task 2.2

Create a `dockerfile` for the _backend-openai_ application. Fill in the necessary contents.

<details>
<summary>Hint</summary>
You can copy the dockerfile for the static backend and reuse it, only a few adjustments is actually necessary.
</details>

<details>
<summary>Solution ✅</summary>
Your file should now look like this:

```docker

FROM node:16-alpine

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]

```

</details>

To comply with the existing code structure let's move the folder containing the new backend into our applications folder.

```shell
mv assets/backend-openai applications # Execute from repository root
```

## Add the new Backend to Docker Compose

Now that the new application is located where we want it lets update our services in the compose file.

Let's start by commenting out the old backend service (_Tip: Don't erase it! It might come in handy later on..._).

Starting out with a new empty service shell, we need to add the build configuration as we just did for the two first services.

### Task 2.3

Creata a new service in the Docker Compose file for our new backend. Remember to add port a mapping to localhost.

<details>
<summary>✅ Solution</summary>
The new service configuration should look something like this:

```yml
backend-openai:
  container_name: codepub-container-workshop-backend-openai
  build:
    dockerfile: backend-openai.dockerfile
    context: applications/backend-openai/
  ports:
    - "8080:8080"
```

</details>

Wow, look at that! The recipies you recieve are now actually relevant and useful for the input ingredients.
Now, for the final part we will use all three applications and even add a fourth service! Lets dive into **[Part 3](../03-proxy-server/README.md)**.
