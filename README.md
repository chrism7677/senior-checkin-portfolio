## Senior Check-In App
Full-stack web application for monitoring senior wellness and check-ins.<br>
Deployed on AWS using Docker, Nginx, MongoDB, and GitHub Actions.

## Live Demo
https://senior.cmiller.dev/

Note: free-tier hosting may sleep


## App Features
- Account registration and profile management
- Backup check-in for mobile app check-ins
- Admin dashboard for monitoring accounts and check-ins
- Email validation API integration


## Technology Features
- MongoDB database integration with Mongoose
- HTTPS reverse proxy using Nginx
- Jest/Supertest integration testing
- Dockerized deployment
- Automated deployment with GitHub Actions


## Tech Stack
### Frontend
- HTML
- CSS
- EJS Templates
### Backend
- Node.js
- Express.js
- HTTPS with Nginx reverse proxy
### Database
- MongoDB
- Mongoose
### DevOps / Deployment
- AWS EC2
- Docker
- GitHub Actions
- PM2 (earlier version)
### Testing
- Jest
- Supertest

## Architecture Overview
```mermaid
flowchart LR
    subgraph ClientSide["Client Side"]
        A["User Browser"]
    end

    subgraph DNS["Cloudflare"]
        B["Domain Registrar<br>and DNS resolution<br>for cmiller.dev"]
    end

    subgraph AWS["AWS Infrastructure"]

        subgraph EC2["EC2 Instance"]
            D["Nginx Reverse Proxy"]
            E["Docker Container<br/>Node.js / Express / EJS"]
            F["SSM Agent<br>triggers deploy.sh"]
        end

        G["AWS SSM<br>(Systems Manager)"]
    end

    subgraph CloudServices["External Services"]
        H["MongoDB Atlas"]
        I["Disify API"]
    end

    subgraph CI_CD["CI/CD Pipeline"]
        J["git push and<br>GitHub Repository"]
        K["GitHub Actions"]
    end

    %% Flow Connections
    A --> B
    A --> D --> E --> H
    E --> I
    J --> K --> G --> F
    F --> E

    %% Class Styles Definition
    classDef client stroke:#2dd4bf,fill:#f0fdfa;
    classDef aws stroke:#818cf8,fill:#eef2ff;
    classDef service stroke:#4ade80,fill:#f0fdf4;
    classDef cicd stroke:#fb923c,fill:#fff7ed;

    %% Assigning Classes to Active Nodes (Fixed Line 46 Area)
    class A client;
    class B service;
    class D,E,F,G aws;
    class H,I service;
    class J,K cicd;
```

## CI/CD Pipeline
GitHub Actions automatically:
1. Runs Jest/Supertest integration tests
2. Blocks deployment if tests fail
3. Authenticates with AWS using GitHub OIDC and IAM roles.
4. Uses AWS Systems Manager (SSM) to trigger deployment.
5. Instructs the local EC2 SSM agent to run `deploy.sh`, which:
    - Pulls latest code
    - Rebuilds/restarts Docker containers


## Future Improvements
- bcrypt passwords
- Implement session authentication
- React frontend migration
- Kubernetes deployment


## Home Screen
<img src="images/home.png" width="700" alt="Home Screen">

## Admin Dashboard
<img src="images/admin.png" width="700" alt="Admin Dashboard">

## CI/CD Pipeline
<img src="images/GitHubActions.png" width="700" alt="GitHub Actions">

