# API Reference

## Authentication

**POST** `/api/auth/login` — Login user.  
**POST** `/api/auth/register` — Register user.

## Tasks

**GET** `/api/tasks` — Fetch all tasks for logged-in user.  
**POST** `/api/tasks` — Create new task.  
**PATCH** `/api/tasks/:id` — Update task.  
**DELETE** `/api/tasks/:id` — Delete task.

## Prescriptions

**GET** `/api/prescriptions`  
**POST** `/api/prescriptions`  
**PATCH** `/api/prescriptions/:id`  
**DELETE** `/api/prescriptions/:id`

## Chat

**GET** `/api/messages/:friendId` — Fetch conversation with a friend.  
**POST** `/api/messages` — Send a message.

## Health Metrics

**POST** `/api/metrics/sleep`  
**POST** `/api/metrics/stress`  
**POST** `/api/metrics/workout`  
**GET** `/api/metrics/:type` — Fetch data by category.
