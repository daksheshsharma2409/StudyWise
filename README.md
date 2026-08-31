# 📚 StudyWise — Peer-to-Peer Study Resource Sharing Platform with AI-Powered Categorization

> **A full-stack web application with AI-powered document categorization using RAG (Retrieval-Augmented Generation) and semantic search.**

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)

---

## 🎯 Project Overview

A modern web platform where students can upload, share, and discover study resources (notes, assignments, practice problems). The platform uses **AI (RAG - Retrieval Augmented Generation)** to automatically categorize uploaded notes into appropriate subjects, eliminating the need for manual tagging. Students can search for resources, rate content quality, and earn reputation points for contributing valuable materials.

---

## ❓ Problem Statement

Currently, study resources are scattered across WhatsApp groups, personal drives, and emails. Students waste time searching for quality notes, and there's no centralized system that:

- ✅ Automatically organizes resources by subject
- ✅ Provides quality ratings through community feedback
- ✅ Gamifies contribution to encourage sharing
- ✅ Offers intelligent search beyond keyword matching

---

## ✨ Features

### Core Features

| Feature                       | Description                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **User Authentication**       | Register/Login with JWT-based authentication; role-based access (Student, Admin)                                                 |
| **Resource Upload**           | Upload PDFs, Word documents, images; automatic text extraction                                                                   |
| **AI-Powered Categorization** | Uses LangChain.js + RAG to automatically detect which subject the notes belong to (e.g., Data Engineering, Algorithms, Calculus) |
| **Smart Search**              | Semantic search using embeddings — find relevant notes even if keywords don't match exactly                                      |
| **Voting System**             | Upvote/downvote resources (like Reddit) to surface high-quality content                                                          |
| **Reputation System**         | Users earn points for uploading resources and receiving upvotes                                                                  |
| **Request System**            | Students can request specific topics; others can fulfill requests                                                                |
| **Trending Feed**             | Shows most popular resources based on votes, views, and recency                                                                  |
| **Analytics Dashboard**       | Admin view: most active users, popular subjects, platform growth metrics                                                         |

### Optional Advanced Features

| Feature                        | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| **AI Summarization**           | Generate 3-line summaries of uploaded notes                |
| **Flashcards Auto-Generation** | Extract key concepts from notes to create study flashcards |
| **Discussion Threads**         | Comment and discuss specific resources                     |

---

## 🏗️ Tech Stack

| Layer              | Technology                                      | Purpose                                     |
| ------------------ | ----------------------------------------------- | ------------------------------------------- |
| **Frontend**       | Next.js + Tailwind CSS + Lucide Icons           | Responsive UI with server-side rendering    |
| **Backend**        | Node.js + Express.js                            | REST APIs, business logic, authentication   |
| **Database**       | PostgreSQL + pgvector extension                 | Relational data + vector embeddings storage |
| **AI/ML**          | LangChain.js + OpenAI API / Gemini API          | RAG pipeline, embeddings, categorization    |
| **Authentication** | JWT (JSON Web Tokens)                           | Secure user sessions with role-based access |
| **File Storage**   | Cloudinary / AWS S3                             | Document storage and CDN delivery           |
| **Deployment**     | Vercel (Frontend) / Render or Railway (Backend) | Production hosting                          |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   Browser   │    │   Browser   │    │   Browser   │       │
│  │  (Student)  │    │  (Student)  │    │   (Admin)   │       │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘       │
└─────────┼──────────────────┼──────────────────┼───────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                    Next.js Frontend                            │
│        - Upload UI  - Search  - Dashboard  - Profiles         │
│                    - Real-time Updates                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                 Node.js + Express.js Backend                   │
│        - REST APIs  - JWT Auth  - File Upload                 │
│        - Business Logic  - Error Handling                     │
└─────────┬────────────────┬────────────────┬────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌──────────────────┐ ┌───────────────┐ ┌──────────────────────┐
│   DATA LAYER     │ │   AI LAYER    │ │   STORAGE LAYER      │
├──────────────────┤ ├───────────────┤ ├──────────────────────┤
│   PostgreSQL     │ │  LangChain.js │ │  Cloudinary / S3     │
│   + pgvector     │ │  RAG Pipeline │ │  - PDFs              │
│                  │ │  - Embeddings │ │  - Images            │
│   - Users        │ │  - Categorize │ │  - Documents         │
│   - Resources    │ │  - Search     │ └──────────────────────┘
│   - Votes        │ └───────────────┘
│   - Requests     │
│   - Comments     │
└──────────────────┘
```

---

## 🗄️ Database Schema (PostgreSQL + pgvector)

### Core Tables

| Table                  | Purpose                                       | Key Fields                                                                 |
| ---------------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| **users**              | Store user profiles                           | `id`, `name`, `email`, `password_hash`, `reputation_score`, `role`         |
| **subjects**           | Pre-defined subjects for categorization       | `id`, `name`, `description`                                                |
| **resources**          | Uploaded notes & materials                    | `id`, `title`, `file_url`, `subject_id`, `user_id`, `upload_date`, `views` |
| **subject_embeddings** | Vector embeddings for subject descriptions    | `id`, `subject_id`, `embedding` (vector type)                              |
| **resource_chunks**    | Chunks of text from documents with embeddings | `id`, `resource_id`, `chunk_text`, `embedding` (vector type)               |
| **votes**              | User votes on resources                       | `id`, `user_id`, `resource_id`, `vote_type` (up/down), `created_at`        |
| **requests**           | Topic requests from students                  | `id`, `user_id`, `topic`, `status`, `created_at`                           |
| **comments**           | Comments on resources                         | `id`, `user_id`, `resource_id`, `text`, `created_at`                       |

## 📝 Conclusion

This project demonstrates:

✅ **Full-stack development** with Next.js + Express.js  
✅ **Data engineering** with PostgreSQL + pgvector  
✅ **AI integration** with LangChain.js + RAG  
✅ **Modern authentication** with JWT
