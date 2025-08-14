# System Architecture

## Overview

HealthMate is a full-stack web application designed to help users track, manage, and gain insights into their health and wellness.  
The system integrates data tracking, task and prescription management, stress monitoring, nutrition insights, and a friendly chatbot for quick tips.

## Architecture Diagram

(Insert diagram image here if available)

**Front-End**

- Built with React + Vite for fast, modular UI.
- TailwindCSS for styling.
- Features responsive design for desktop and mobile use.

**Back-End**

- Node.js + Express API.
- RESTful endpoints for CRUD operations.
- Authentication using JWT.

**Database**

- MongoDB Atlas for cloud-based, scalable data storage.

**Key Modules**

- **Dashboard:** Centralized health summary.
- **Task Management:** Daily and medical task tracking.
- **Chatbot:** Quick health tips and FAQ responses.
- **Messaging:** Friend-to-friend chat.
- **Workout & Nutrition:** Tracking and guidance modules.
- **Stress & Sleep Monitoring:** Data input, visualization, and trend analysis.

## Data Flow

1. User interacts with the front-end.
2. Front-end communicates with the Express API.
3. API fetches/stores data in MongoDB.
4. Updates are reflected on the dashboard in real-time.
