# Alert watcher 

## Introduction

- Alert watcher is a web application displaying alerts for meteorological phenomena in regions and municipalities with extended competence in the Czech Republic.
- The application allows users to create an account and set up email notifications for selected phenomena in their chosen location.

### Backend
  - C# .NET 6 Core Web API
  - MSSQL (Microsoft SQL Server)

### Frontend
  - React.js
  - Sass

## Table of Contents

1. [Introduction](#introduction)
2. [Backend](#backend)
3. [Frontend](#frontend)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Database Migrations](#database-migrations)
8. [Deployment](#deployment)
9. [Credits](#credits)

## Installation

- **Cloning the Repository**:
   ```bash
   git clone https://github.com/DanielPaviza/hlidacVystrah.git
   cd hlidacVystrah

- **Dependencies**
    - Technologies
      - [Node.js](https://nodejs.org/en/)
      - [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
    - Frontend
        - axios 1.6.5
        - react-bootstrap 2.9.2
        - react-helmet 6.1.0
        - sass 1.69.5
    - Backend
        - MailKit 4.3.0
        - Microsoft.AspNetCore.SpaProxy 6.0.11
        - Microsoft.EntityFrameworkCore 7.0.12
        - Microsoft.EntityFrameworkCore.SqlServer 7.0.12
        - Microsoft.EntityFrameworkCore.Tools 7.0.12
        - Swashbuckle.AspNetCore 4.5.0

- **Installing Dependencies**
  - **Backend**
    ```bash
    cd /hlidacVystrah/hlidacVystrah
    dotnet restore
    
  - **Frontend**
    ```bash
    cd /hlidacVystrah/hlidacVystrah/ClientApp
    npm install

## Configuration
- In the `appsettings.json` and `appsettings.Development.json` files, you need to set the connection string for database connection and the SMTP server details for sending emails.

## API Documentation
### Frontend
- **/**
  - Introduction page of the Alert watcher application.

- **/obec/:cisorp**
  - Page with information about the selected location based on its CISORP code.
  - For example, `/obec/1100` displays details of the municipality Prague, `/obec/3209` displays details of the municipality Pilsen.

- **/register**
  - Page for creating a new user account.

- **/resetpassword**
  - Page for resetting forgotten password and sending a link to set a new password to the specified email.

- **/newpassword**
  - Page for changing forgotten password.

- **/activateaccount**
  - Page for activating a newly created account.

- **/login**
  - Page for logging into the account management.

- **/account**
  - Page for user account management with the option to edit tracked phenomena.

- **/_adm**
  - Application administration page.

- **/_adm/logs**
  - Application administration page with logs.

- **/_adm/users**
  - Application administration page with users.

### Backend
- Swagger can be used for API documentation. After running the project, API documentation can be accessed via the URL `/swagger`.
  - Swagger UI provides an interactive interface for browsing and testing API endpoints.
  - Users can easily browse available endpoints, view their parameters, and send requests directly from the interface.

## Database Migrations
- The project contains a `Migrations` folder with database migrations. Users only need to run database update using Entity Framework Core migrations.

1. Open the command prompt or terminal in the project directory.
2. Run the following command to apply migrations and create the database schema:
   ```bash
   dotnet ef database update

## Deployment
### Using Visual Studio 2022

1. Open the project in Visual Studio.
2. Right-click on the project and select "Publish".
3. Follow the publishing wizard and select the destination where the application should be deployed.

### Using Command Line

1. Open the command prompt or terminal in the project directory.
2. For building and deploying the backend part of the application, use the command:
   ```bash
   dotnet publish -c Release
3. The resulting package will be located in the `bin/Release/net6.0/publish` directory.

- Insert the MailTemplates folder into the published application directory.

## Credits
- **[ČHMÚ](https://www.chmi.cz/) (Czech Hydrometeorological Institute):** Providing [meteorological data](https://www.chmi.cz/files/portal/docs/meteo/om/bulletiny/XOCZ50_OKPR.xml).
