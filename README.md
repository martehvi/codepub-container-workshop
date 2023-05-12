# Planning session 

Ønsker å bygge videre på det som allerede ble laget i tidligere TechCollege 

Nå vil vi sette opp ting i Docker Compose

1. Utgangspunkt: vi har allerede spint opp, der det er 2 containere, med Docker Compose og alt slik at dette kjører og fungerer. 

| Frontend | - | Backend | 


2. Vi skal nå erstatte/oppdatere backenden, slik at den nå kan bruke ChatGPT! 
    - Steg 0: To containere satt opp med Docker Compose, v1 backend 
     | Frontend | < http://localhost:8080-> | Backend v1| 
    - Steg 1: Erstatt gammel backend container med ChatGPT v2 backend, spinn opp i Docker Compose
    | Frontend | <-http://localhost:8080> | Backend v2 | 
    - Steg 2: Ha begge backendene oppe i Docker Compose, og legg til en load balancer - dette legges til i Docker Compose
    | Frontend | <-http://localhost:8080/v1 ELLER http://localhost:8080/v1 > | Backend v1 | ELLER | Backend v2 | 



Diskuterte rundt om vi skulle ha imagene publisert på dockerhub - men siden det både er litt privacy-problem hvis vi har openAI keys, så kan vi istedet bruke Docker Desktop - der etter `docker build image "navn"` så er denne "Publisert" i Docker Desktop - og kan brukes i Docker Compose 


Diskusjon rundt ChatGPT tokenet: 
- siden vi ikke vil ha det public (hverken på dockerhub eller github), så kan vi få alle til å bruke sine egne ChatGPT tokens, og legge det til manuelt i docker imaget! Det gir studentene muligheten til å lære seg
`docker exec/ssh` `vim env` => erstatte "{YOUR_API_KEY}" med din egen i denne filen


TO DO: 
- Lage Docker compose fil for applikasjonene som var laget i tidligere TechCollege


# Setting up repo on your computer:
After cloning the repo, it should be sufficient to run `docker compose up` inside the repo root folder. Assumed that you already have Docker with Compose plugin setup 