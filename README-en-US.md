# 💡 Profet: Backend Remake MVC

> Original project [Profet](https://github.com/Inguim/profet)

A rewrite of a backend originally written in Laravel, using Node.js and TypeScript with an MVC architecture.

The project manually recreats many implementations from the original project, adapting them to the context of the chosen frameworks while trying to stay faithful to it. However, it completely ignores the View layer, focusing only on backend logic. So, if you expect an interface for this backend, I think you will be disappointed.

---

## 🚀 Motivation

When the original project idea was conceived, there was a version written in AdonisJS. However, over time, the possibility of switching from Laravel arose, because it would make it easier to release the platform. However, I always wondered how it would be in TypeScript/JavaScript, and because of this curiosity the idea of the project was created.

---

## 🧠 Architecture

The application follows the principles of **MVC with auxiliary layers**, with a strong separation between them.

## 📁 Project structure

```
src/
├── controllers/
├── database/
├── dto/
├── errors/
├── events/
├── listeners/
├── middlewares/
├── models/
├── observers/
├── providers/
├── routes/
├── services/
├── utils/
├── validators/
```

### 🧩 Responsabilities

> If you are a new developer and don't know the responsibilities of these folders, this section will be useful. Otherwise, you can just skip it 😉

- **controllers/**
  - Entry point of the application (HTTP)
  - Receives requests e returns responses

- **services/**
  - Business rules
  - Resposible for creating the main flow

- **models/**
  - Close to a repository, it uses core entities for persistence and is responsible for the database communication

- **database/**
  - Contains the database configuration and table/seed structure

- **dto/**
  - Defines the input and output contracts

- **validators/**
  - Data validation

- **middlewares/**
  - Intercepts requests (ex: authentication, validation)

- **events / listeners**
  - Implements an event-driven architecture

- **observers/**
  - Reacts to state changes (as in Laravel)

- **providers/**
  - Dependency injection and configuration

- **errors/**
  - Error standardization across the application

- **utils/**
  - Helpers functions

---

## 🔄 Application flow

```
Request
  ↓
Controller
  ↓
Middlewares / Validator / DTO
  ↓
Service
  ↓
Model / Database
  ↓
Events / Observers
  ↓
Response
```

---

## 🔧 Technologies

- Node.js
- TypeScript
- Express
- Vitest
- Docker
- FakerJs
- KnexJs
- Swagger

---

## ⚙️ Setup project

> Since this is just a study case, there is no Dockerfile to create a build version or anything similiar. In this case, Docker is only used to simplify the configuration of the database connection.

### 📄 Variáveis de ambiente

Use this files as examples:

```
.env.example
.env.test.example // if you want to run tests, you will need to configure this file
```

```bash
# Clone repository
git clone https://github.com/Inguim/est-profet-back-remake

# Go to project branch
git checkout mvc

# Install dependencies
npm install

# Up environment (if use docker)
docker-compose up -d

# Run application
npm run dev
```

---

# 🧪 Tests

The projects contains a test structure that mirrors the main codebase:

```
tests/
├── dto/
├── factories/ -> used to simplify test creation
├── middlewares/
├── models/
├── observers/
├── providers/
├── services/
├── utils/
├── validators/
```

### Run test

```bash
npm run test
```

---

## 🔐 Features

Every feature in the original project was mapped according to the Laravel structure and can be tracked in this file [Tracker.md](https://github.com/Inguim/est-profet-back-remake/blob/mvc/TRACKER.md). The following are the main features

- JWT authentication (replaces OAuth in the original project, as it is unnecessary in both projects)
- Flow control for public, admin and authenticated routes
- Structured data validation using validators and middleware
- A simple event-driven implementation
- Addition of services, DTOs and providers layers
- GitHub API integration to search for users information (now handled by the backend)
- Adds an email handling abstraction (currently using a FakeProvider for demonstration purposes only)
- Simple notification flow
- Adds unit and integration tests (not included in the original project)
- Adds API documentation with Swagger (not included in the original project)
- Adds pagination for lists

---

## 🤔 Reflections

This was a project that initially seemed easier, but ended up requiring a considerable amount of effort to due to the outdated original codebase. This leaded to many hours spent triyng to get the original application to run without throwing an exceptions in the terminal.

Was development progressed, things started to align, and I began to understand how it should work. I also found the original documentation (UML diagrams, use cases, etc...), which made the implementation of the project easier.

In terms of code, it was relatively easier to map between the projects, as the new code was not constrained by a strict framework pattern. However, implementing events and observers was really enjoyable, because I didn't choose to use the native Node.Js events module, which is different in Laravel, as it has its own unique ready-to-use implementation.

---

## 🔮 Future improvements

> Like every good project, there are always things to improve

- JWT authentication with Refresh token
- Rate limiting (mainly for public routes)
- Security Headers
- Decouple KnexJs from the model layer and make it eaiser to use transactions
- Investigate and resolve the N+1 problem in the user module
- Reduce coupling between service and model layers
- Add a flow to promote a user to admin without directly using the database
- Add CORS support
- Add a Dockerfile for builds
- Add a real email provider (SMTP)
- Improve the folder structure and organize types and interfaces into dedicated files per implementation

## 🕵️‍♂️ Curiosities

If you've made it this far, you might find this interesting:

- Total time tracked: 123h 33min 12s (yes, even the seconds were tracked)
- Total time tracked on the original project: ~15h
- Total endpoints: 37 (incluiding the new ones)
- Earnings: $0 😄

---

## 👨‍💻 Author

Igor Azevedo
