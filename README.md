# NITK - Big3

## Team Members

- _Team Lead:_ Udit Jain
- _Member 1:_ Ankush Kumar
- _Member 2:_ Ankur

## Problem Statement

### Theme

In the fast-paced world of academia, students often struggle with organizing and retrieving study materials effectively.

### Problem Statement

Develop an application that allows users to load their study notes—whether text, images, or audio—and automatically generates a personal knowledge graph/highlight. This graph will help students quickly find and connect key concepts, making study sessions more efficient and tailored to their learning style. The app must support various input types, including text documents, handwritten notes, images, and audio recordings, and effectively parse these formats to extract meaningful information.

### Solution Demo Video Link

[Demo Video](https://youtu.be/1pyXAscuhZQ)
[![Alt text](https://img.youtube.com/vi/1pyXAscuhZQ/0.jpg)](https://www.youtube.com/watch?v=1pyXAscuhZQ)

## Tech Stack

### Frontend

- Vite
- React

### Backend

- Python
- Flask
- Poetry
- OpenAI Python SDK

## Prerequisites

- Python
- Poetry
- OpenAI API Key
- Firebase Project Credentials
- Git

## Getting Started

### Installation Steps

### Clone the Repository

```bash
git clone https://github.com/your-username/knowledge-distiller-app.git
cd knowledge-distiller-app
```

### Frontend Setup

```bash
cd code/frontend
npm install
```

### Backend Setup

```bash
cd code

# Install dependencies using Poetry
poetry install

# Activate virtual environment
poetry shell
```

## Environment Variables

### Backend (.env)

```
GROQ_API_KEY=groq_api_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_API_KEY=langchain_api_key
LANGCHAIN_PROJECT=langchain_project_name
OPENAI_API_KEY=openai_api_key
FIREBASE_BUCKET_NAME=firebase_bucket_name
```

## Configuration Steps

### 1. OpenAI API Setup

1. Go to [OpenAI API Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your backend `.env` file as `OPENAI_API_KEY`

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication and select desired providers (Email/Password, Google, etc.)
4. Go to Project Settings
5. Scroll down to "Your apps" section
6. Click on Web icon (</>)
7. Register app and get configuration
8. Copy the file in the `/code` directory
   ```javascript
   // Your firebase configuration will look like this
   const firebaseConfig = {
     apiKey: "xxx",
     authDomain: "xxx",
     projectId: "xxx",
     storageBucket: "xxx",
     messagingSenderId: "xxx",
     appId: "xxx",
   };
   ```

## Run the Project

### 1. Run Frontend from /code/frontend directory

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Run Backend from /code directory

```bash
python app.py
```

The backend API will be available at `http://localhost:5000`
