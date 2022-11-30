<div align="center" style="margin-bottom:2em">
    <h1 style="border: 0; margin-bottom: 0.3em;">Aarbolito API</h1>
    <img src="https://nestjs.com/img/logo-small.svg" width="75" alt="Nest Logo" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://graphql.org/img/brand/logos/logo.svg" width="75" alt="Nest Logo" />
    <h2 style="font-family:monospace;">&nbsp;NestJS + GraphQL</h2>
    <hr />
</div>

## Para ejecutar en desarrollo

<br/>

1. Clonar el repo

   ```
   git clone --branch dev https://github.com/Riuaux/restaurante-api.git
   ```

2. Cargar las dependencias

   ```
   yarn install
   ```

3. Instalar Nest CLI

   ```
   npm -i -g @nestjs/cli
   ```

4. Verificar las variables de entorno y el archivo Docker

   ```
   .dev.env
   docker-compose.yaml
   ```

5. Levantar la base de datos

   ```
   docker-compose up -d
   ```

6. Ingresar el primer User directo en la DB

   ```
   {
      "_id": {
         "$oid": "636d388883a44912fba8e3a2"
      },
      "authCode": "3333",
      "username": "RIUAUX",
      "password": "$2b$07$jqT/HlcEwnG4FlWlOnaRQO7zechGVeqd6jJEVe9MJ6/DMwyiaR9y.",
      "firstName": "Agustín",
      "lastName": "Camarena González",
      "phoneNumber": "3485933208",
      "role": "admin",
      "isActive": true,
      "createdAt": {
         "$date": {
            "$numberLong": "1665151440666"
         }
      },
      "updatedAt": {
         "$date": {
            "$numberLong": "1668701556110"
         }
      },
      "updatedBy": {
         "$oid": "636d388883a44912fba8e3a2"
      },
      "__v": 0
   }
   ```

7. Iniciar el servidor en Dev

   ```
   yarn start:dev
   ```

8. Abrir el [Apollo Sandbox](https://localhost:3003/graphql)

   ```
   https://localhost:3003/graphql
   ```

<br />

Hay que iniciar una sesión para las acciones que requieran un Token. Desde la _mutation_ "Login", se usa un _authCode_ de cualquier usuario creado en el Seed, y la contraseña por defecto es _`321321`_.

<br />
<hr />
<br />

## Stack utilizado

- Docker
- MongoDB
- NestJS
