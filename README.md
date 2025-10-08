# **E-commerce Platform**
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/luizGTogni/ecommerce-platform/blob/main/LICENSE)

Esta é uma API RESTful desenvolvida em Node.js para gerenciar um sistema completo de e-commerce, incluindo funcionalidades de produtos, carrinho, pedidos, pagamentos e usuários.
O projeto foi construído com foco em boas práticas de arquitetura e testabilidade, seguindo os princípios do Clean Architecture e DDD (Domain-Driven Design).

---

## Índice

- [**MyGoals**](#mygoals)
  - [Índice](#índice)
  - [Introdução](#introdução)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
    - [**Backend**](#backend)
      - [**Funcionalidades Principais**](#funcionalidades-principais)
      - [**Tecnologias**](#tecnologias)
    - [**Testes**](#testes)
      - [**Abordagem de Testes**](#abordagem-de-testes)
      - [**Tecnologias Utilizadas para Testes**](#tecnologias-utilizadas-para-testes)
  - [Instalação](#instalação)
    - [**Pré-requisitos**](#pré-requisitos)
    - [**Passos**](#passos)
  - [Como contribuir](#como-contribuir)
  - [Contato](#contato)

---

## Tecnologias Utilizadas

### **Backend**

#### **Funcionalidades Principais**

- **Registro de Usuário**: Cadastro de novos usuários.
- **Login de Usuário**: Autenticação segura (JWT) para acesso às funcionalidades.
- **Gerenciamento de Produtos**: CRUD para gerenciar produtos.
- **Carrinho**: CRUD para adicionar e remover produtos.

#### **Tecnologias**

- **Linguagem**: Javascript (Node) / Typescript
- **Framework**: Fastify
- **Docker**: Docker compose
- **Banco de Dados**: PostgreSQL (Prisma ORM) e Redis (IORedis)
- **Autenticação**: Baseada em token JWT

### **Testes**
#### **Abordagem de Testes**
Foram implementados **testes unitários**, **testes integração** e **testes end to end** em toda a aplicação para garantir a qualidade e a robustez do sistema.
#### **Tecnologias Utilizadas para Testes**
- **vitest**: Utilizado para criar testes unitários, integração e e2e.
- **supertest**: Utilizado para criar servidor teste do e2e

---

## Instalação

### **Pré-requisitos**
Certifique-se de que você tenha instalado:
- `Node`
- Docker

### **Passos**

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/luizGTogni/ecommerce-platform.git
    ```

2. **Navegue para o repositório:**:

   ```bash
   cd ecommerce-platform
   ```

3. **Instale as dependências:**:

   - For Backend:

     ```bash
     cd ecommerce-api
     pnpm install
     ```
    
4. Configure o banco de dados:
      - Edite o arquivo .env e rode 
      ```bash
      docker compose up -d
      ```
5. Suba as migrations:
    ```bash
    pnpm migrate
    ```

- **Para executar o Backend**:
1. Certifique-se de que o ambiente virtual está ativado
2. Inicie o servidor Node:
    ```bash
    pnpm start:dev
    ```
3. Acesse o backend no navegador em: http://localhost:3000
  

## Como contribuir
1. **Fork esse repositório.**
2. **Crie uma branch para a sua mudança:**
   ```bash
   git checkout -b sua-branch
   ```
3. **Faça suas alterações e envie um pull request:**
   ```bash
     git add .
     git commit -m "feat: Descrição da mudança"
     git push origin sua-branch
   ```
---

## Contato
- Developers: Luiz Togni
- LinkedIn:
- [Luiz Togni](https://www.linkedin.com/in/luizgustavotogni/)
