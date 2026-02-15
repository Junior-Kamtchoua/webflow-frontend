Workflow File Management

Workflow File Management is a full-stack B2B SaaS platform for secure file management, team collaboration, and workflow monitoring. The system is built with a production-oriented architecture, role-based access control, and cloud deployment readiness.

Live Frontend: https://workflow-file-management.vercel.app

Backend API: https://workflow-api.onrender.com

Overview

Workflow File Management enables organizations to securely upload, manage, share, and monitor files across multiple roles:

Admin

Manager

User

The platform enforces strict role isolation, transactional storage control, and centralized activity logging to ensure data integrity and operational transparency.

Core Features
Authentication and Authorization

JWT-based authentication

Role-based access control (Admin / Manager / User)

Protected frontend routes

Secured API endpoints with permission classes

Middleware-level access enforcement

File Management

Secure file uploads with validation

Transactional storage quota enforcement

Automatic storage tracking

Physical file deletion on record removal

Permission-aware file downloads

Collaboration

File sharing between users

Share status management (Pending, Accepted, Rejected)

Favorites system

Shared-with-me dashboard

Activity Logging

Centralized activity tracking (Upload, Download, Share, Delete, Login, Logout)

Indexed log storage for efficient retrieval

Manager and Admin log visibility

System-wide monitoring endpoint

Dashboards

Admin Dashboard:

User management (CRUD)

Storage overview

Role distribution

User growth analytics

System logs

Manager Dashboard:

Project overview

Team performance tracking

Weekly upload analytics

File distribution metrics

Growth reporting

User Dashboard:

Personal file management

Storage usage tracking

Weekly activity analytics

Favorites and shared files

Architecture

Frontend:

React (Vite)

Axios

Bootstrap

Protected routing

Context-based authentication management

Backend:

Django

Django REST Framework

JWT (SimpleJWT)

Custom permission classes

Transaction-safe storage logic

Activity logging utilities

Database:

PostgreSQL (Neon)

Indexed relational schema

Optimized queries using select_related and aggregation

Deployment:

Frontend deployed on Vercel

Backend deployed on Render

PostgreSQL hosted on Neon

Security Design

Role-based access control with zero cross-role leakage

Strict permission filtering at queryset level

JWT-based session management

File validation (type and size restrictions)

Transactional database updates to prevent quota race conditions

Permission-aware download endpoints

Database Models

Core models include:

User (custom role-based user model)

Project

File

ActivityLog

FileShare

Favorite

Relational integrity and indexing strategies are applied to optimize performance and ensure data consistency.

Performance Considerations

Indexed frequently filtered fields

Aggregation-based analytics endpoints

Optimized related queries using select_related

Reduced API response time through filtered querysets

Controlled file lifecycle operations to prevent storage inconsistencies

Local Development
Backend Setup

Create a virtual environment

Install dependencies

pip install -r requirements.txt

Set environment variables:

SECRET_KEY
DATABASE_URL

Run migrations

python manage.py migrate

Start server

python manage.py runserver

Frontend Setup

Install dependencies

npm install

Configure environment variable:

VITE_API_URL=http://127.0.0.1:8000/api/

Start development server

npm run dev

Production Deployment

Frontend:

Hosted on Vercel

Build output: dist

Backend:

Hosted on Render

Gunicorn production server

Environment variables configured in dashboard

Database:

Neon PostgreSQL (cloud hosted)

Project Status

This project is production-ready in terms of architecture, security structure, and cloud deployment design. It demonstrates:

Multi-role SaaS architecture

Secure backend logic

Scalable API design

Production-level file management logic

Cloud deployment integration
