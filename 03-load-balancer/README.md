# Part 3: Add a Load Balancer

Even though the static backend did not provide a very useful recipe we should adapt our application to accomodate for the users that (for some inknown reason) would want to still use the old Backend.

In this final task, we will therefore extend our Docker Compose configuration to include both the static and the OpenAI backend as separate services. To distribute traffic between the two backends we will add another service, a _Load Balancer_.

## What is a Load Balancer

A load balancer is a service that distributes incming traffic across multiple servers or backend resources to optimize performance, maximise throughput and ensure high availability of applications and services.

- A common use area is in web applications to evenly distribute traffic among servers, improving scalability and responsiveness.

- _Example_: During a high-traffic event on an online store, such as a huge sale, a load balancer directs incoming requests to multiple backend servers, preventing overload and ensuring smoother user experience.

There are several different algorithms possible to use and follow in this request distribution, such as: Round-robin, randomization, least connection, or weighted distribution.

## Balance traffic between Backends

Load balancing is commonly used to blance traffic directed towards the same application. In our case we want to realize this by using two different backend applications and '_balance the load_' between the two.

Without further ado let's add a **Load Balancer** to our Docker Compse file!

**TODO - Add loadbalancer code guide, tasks and spultions**

Congratulations! You have now learned about and compleated the Docker Compose workshop! We hope you learned something new ansdexiting, and had fun doing so!
