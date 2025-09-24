# ShareSpace – AI-Powered Roommate Matching Platform

Finding a compatible roommate is harder than it should be. Profiles on existing platforms are often shallow, and matching is random at best. My friend and I started **ShareSpace** with the belief that living situations shape not just comfort but also productivity and wellbeing — and that better matching leads to better lives.

Our **mission** is to build a safe and intelligent roommate discovery platform: one that combines AI-driven compatibility with reliable verification and a smooth user experience. Our **vision** is to make roommate searching as transparent and stress-free as finding a playlist you love — informed by your personality, lifestyle, and preferences.

---

## 🚀 Overview

ShareSpace is a full-stack web platform that:
- Captures **detailed lifestyle preferences** through onboarding forms.  
- Uses **SBERT (Sentence-BERT)** to analyze and compare user profiles for semantic similarity.  
- Provides a **real-time chat** system so matched users can connect immediately.  
- Plans to integrate **identity verification** and **insurance partnerships** for trust and safety.  

This project is both a technical exploration and a product experiment: blending backend engineering, AI microservices, and UX design into a deployable service.

---

## ✨ Features

- **AI Matching Engine**  
  - SBERT embeddings calculate roommate compatibility beyond basic yes/no questions.  
  - Profiles compared in vector space for nuanced, human-like similarity scoring.  

- **User Profiles & Preferences**  
  - Structured onboarding form (habits, schedules, personality traits).  
  - Stored via Sequelize migrations for database consistency.  

- **Real-Time Chat**  
  - Socket.IO messaging with typing indicators, read receipts, and instant updates.  
  - Designed to scale horizontally across multiple rooms.  

- **Authentication & Security**  
  - JWT-based login flow with refresh tokens.  
  - Planned integration for Google, Apple, and Facebook sign-ins.  

- **Localization & Accessibility**  
  - Built with multi-language support in mind (English, Korean, Indonesian).  
  - Lightweight front-end for responsiveness and accessibility.  

- **Analytics & Growth**  
  - Conversion funnels and retention tracking to measure impact.  
  - Business roadmap includes freemium model, ad revenue, and verified identity tiers.  

---

## 📈 Impact (so far)

- Built and deployed an **MVP** web app supporting onboarding, profile matching, and chat.  
- Designed a **scalable architecture**: Node.js + Express backend, SBERT microservice via Flask, MySQL with Sequelize migrations.  
- Drafted product strategy for monetization and trust-building features (identity verification, insurance, premium tiers).  

---

## 🧰 Tech Stack

- **Backend:** `Node.js`, `Express`, `Sequelize`, `MySQL`  
- **AI/ML Microservice:** `Python`, `Flask`, `SBERT`  
- **Frontend:** `HTML`, `CSS`, `JavaScript` 
- **Real-Time Messaging:** `Socket.IO`  
- **Authentication:** `JWT` 
- **Dev Tools:** `Docker`, `Git`, `Postman`  

---

## 👥 Contributors

- **Jinho Choi** – Backend design, AI similarity engine, real-time messaging, product roadmap  
- **Tom Park** – Frontend design, onboarding UX, user research  

---
