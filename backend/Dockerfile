FROM python:3.8-slim-buster

WORKDIR /app

COPY . .
RUN python model.py

EXPOSE 3000
CMD ["/bin/bash"]