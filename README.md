# 💡 Profet: Backend Remake MVC

> Read in [English](https://github.com/Inguim/est-profet-back-remake/tree/mvc/README-en-US.md)

> Projeto original [Profet](https://github.com/Inguim/profet)

Reescrita de um backend originalmente desenvolvido em Laravel, utilizando Node.js e TypeScript com uma arquitetura MVC.

O projeto recria manualmente diversas implementações feitas no projeto original, adaptando para o contexto das ferramentas escolhidas e tentando ao máximo respeitar o que
já existia. Porém, este projeto ignora completamente a camada View, lidando apenas com as regras de backend. Portanto, se você espera ver uma interface consumindo esse backend, creio que ficará desapontado 🥶.

---

## 🚀 Motivação

Quando a ideia do projeto original foi concebida, houve uma versão escrita com AdonisJS. Porém, com o tempo, surgiu a possibilidade de migrar para o framework Laravel, pois facilitaria o processo de disponibilização da plataforma. Ainda assim, eu sempre me perguntei como teria ficado esse projeto em Typescript/Javascript, dai então que surgiu a ideia deste projeto.

---

## 🧠 Arquitetura

A aplicação segue uma arquitetura baseada em **MVC + camadas auxiliares**, com forte separação de responsabilidades.

### 📁 Estrutura do projeto

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

### 🧩 Responsabilidades

> Caso você seja um dev iniciante e não conheça as responsabilidades de cada uma dessas pastas, esta seção pode ser útil. Caso contrário, pode pular 😉

- **controllers/**
  - Entrada da aplicação (HTTP)
  - Recebem requests e retornam responses

- **services/**
  - Regras de negócio
  - Orquestração dos fluxos principais

- **models/**
  - Manipulação das entidades básica para persistência e comunicação com os modelos do banco sendo bem próximo de um repository

- **database/**
  - Configuração do acesso ao banco e a estrutura de tabelas e seeds

- **dto/**
  - Definição de contratos de entrada/saída

- **validators/**
  - Validação de dados

- **middlewares/**
  - Interceptação de requisições (ex: autenticação, validação)

- **events / listeners**
  - Implementação de arquitetura orientada a eventos

- **observers/**
  - Reação a mudanças de estado (inspirado no Laravel)

- **providers/**
  - Injeção/configuração de dependências

- **errors/**
  - Padronização de erros da aplicação

- **utils/**
  - Funções auxiliares reutilizáveis

---

## 🔄 Fluxo da aplicação

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

## 🔧 Tecnologias

- Node.js
- TypeScript
- Express
- Vitest
- Docker
- FakerJs
- KnexJs
- Swagger

---

## ⚙️ Ambiente e execução

> Como é apenas um cenário de estudo, não adicionei um Dockerfile para geração de build ou similar. Neste caso, o Docker é utilizado apenas para facilitar a configuração e conexão com o banco de dados.

### 📄 Variáveis de ambiente

Utilize os arquivos de exemplo:

```
.env.example
.env.test.example // caso queira rodas testes, é necessário configurar esse arquivo
```

```bash
# Clonar repositório
git clone https://github.com/Inguim/est-profet-back-remake

# Entrar na branch MVC
git checkout mvc

# Instalar dependências
npm install

# Subir ambiente (caso utilize docker)
docker-compose up -d

# Rodar aplicação
npm run dev
```

---

## 🧪 Testes

O projeto possui uma estrutura de testes espelhando o código fonte:

```
tests/
├── dto/
├── factories/ -> sessão existente apenas para facilitar a escrita de alguns testes
├── middlewares/
├── models/
├── observers/
├── providers/
├── services/
├── utils/
├── validators/
```

### Rodar testes

```bash
npm run test
```

---

## 🔐 Funcionalidades implementadas

Todas as funcionalidades presentes no projeto original foram mapeadas de acordo com a estrutura do Laravel e podem ser melhor observadas neste arquivo [Tracker.md](https://github.com/Inguim/est-profet-back-remake/blob/mvc/TRACKER.md). Abaixo estão as principais:

- Autenticação JWT (em substituição ao OAuth do projeto original, que era desnecessário em ambos os contextos)
- Controle de rotas públicas, autenticadas e administrativas
- Validação de dados estruturada com validators e middlewares
- Implementação simples de arquitetura orientada a eventos
- Adição de Services, DTOs e Providers
- Integração com a API do GitHub para busca de informações de usuários contribuidores (antes feita no frontend)
- Adição de abstração para envio de emails (atualmente com FakeProvider para fins de exemplificação)
- Fluxo simples de notificações
- Escrita de testes unitários e de integração (não presentes no projeto original)
- Documentação da API via Swagger (inexistente no projeto original)
- Paginação em endpoints de listagem

---

## 🤔 Reflexões (quase um bate papo)

Foi um projeto que, inicialmente, parecia simples, mas acabou exigindo certo esforço devido ao código-fonte original estar desatualizado. Isso gerou várias horas tentando fazer a aplicação rodar sem lançar exceções no terminal.

Com o avanço do desenvolvimento, as coisas começaram a se alinhar, e fui relembrando como tudo funcionava. Inclusive, encontrei a documentação original (UML, casos de uso, etc.), o que facilitou bastante.

Em relação a código, foi relativamente tranquilo fazer o mapeamento de um projeto para o outro, principalmente por não estar preso a um framework robusto que impõe padrões rígidos. No entanto, vale destacar que a implementação de Events e Observers foi divertida, já que optei por construir isso manualmente ao invés de utilizar o módulo nativo de eventos do Node.js — diferente do Laravel, que já oferece essa estrutura pronta.

---

## 🔮 Melhorias futuras

> Como todo bom projeto, sempre há espaço para melhorias

- Autenticação com JWT + Refresh Token
- Rate limiting (principalmente para endpoints públicos)
- Security Headers
- Desacoplar a camada de Models do KnexJS e facilitar o uso de transactions
- Analisar e mitigar possíveis problemas de N+1 no módulo de usuários
- Reduzir acoplamentos entre Services e Models
- Criar fluxo para promover usuários a admin sem acesso direto ao banco
- Adicionar Cors
- Criar Dockerfile para build
- Implementar um provider real para envio de e-mails (SMTP)
- Separar types e interfaces em arquivos próprios e melhorar a estrutura de pastas para proporcionar uma melhor legibilidade

## 🕵️‍♂️ Curiosidades

Se você chegou até aqui, talvez ache interessante:

- Tempo total rastreado no projeto: 123h 33min 12s (sim, os segundos também foram rastreados)
- Tempo gasto entendendo o projeto original: ~15h
- Total de endpoints: 37 (incluindo novos)
- Remuneração gerada: R$ 0 😄

---

## 👨‍💻 Autor

Igor Azevedo
