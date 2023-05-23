# Docker Compose Workshop

This is a Docker Workshp where you will learn how to containerize and orchestrate a multi-service application using **Docker Compose**. Docker compose is a tool that allows you to define and run multi-container Docker applications. It simplifies the process of managing multiple containers, their dependencies, networks, and volumes, making it easier to develop and deploy complex applicaitons. In this workshop we will make use of Docker Compose to set-up and manage our services, or _applications_ as we call them in this repo.

## Application Overview

Lets take a look at the three applications involved in this workshop:

- **Frontend:** This is a Cookbook application where users can enter a list of ingredients and receive a recipe in return. Initially, we will set up the frontend to interact with the static backend

- **Static Backend:** The static backend serves as a simple starting point. It provides the frontend with a predefined, generic recipe.

- **OpenAI Backend:** A _smart, dynamic_ backend leveraging OpenAI technology. The OpenAI backend uses machine learning algorithms to generate recipes dynamically based on the provided ingredients.

## Prequisites

- _Docker Desktop (or similar)_ - Install a container image build tool and _container runtime_, the simplest beeing the all-in-one solution Docker Desktop. If using any other container image build tool or runtime, be sure to adapt the workshop's docker commands to fit your tools.
- _Git_ - as you probably want to git clone https://gitlab.netlight.com/mhau/codepub-container-workshop.git

## Content

1. [Docker Compose](../01-docker-compose/README.md)
2. [Replace Backend](../02-replace-backend/README.md)
3. [Load Balancer](../03-load-balancer/README.md)
