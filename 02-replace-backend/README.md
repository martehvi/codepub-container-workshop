# Part 2: Replace Backend

Now let's take our application to the next level! Currently (_as you probably noticed_) the recipie is the same regardless of what ingedients we enter. So, this next part will involve replacing the static backend with a dynamic one based upon OpenAI technology! By leveraging OpenAI the new backend will generate dynamic recipes based on the ingredient input!

Dont worry, the backend for this already exists so all you have to focus on is the `docker-compose.yml` file.

Let's start by commenting out the old backend service (_Tip: dont erase it as it might come in handy later on_).

Starting out with a new empty service shell, we need to add the build configuration as we just did for the two first services. TStart by locating the docker file uin the correct applications

**TODO - make tasks and solutions**

Wow, look at that! The recipies you recieve are now actually relevant and useful for the input ingredients.
