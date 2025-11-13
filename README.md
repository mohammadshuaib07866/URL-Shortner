# 🔗 URL Shortener API

A secure and modern **URL Shortener** built with **Express.js**, **Drizzle ORM**, **JWT Authentication**, and **PostgreSQL**.  
This API allows users to register, log in, shorten URLs, view shortened links, and delete their own links securely.

---

## 🚀 Features

- 🔐 **JWT Authentication** for secure user access  
- 🧠 **Drizzle ORM** for type-safe database queries  
- ✂️ **URL Shortening** using `nanoid`  
- 📥 **Redirects** users to the original long URL  
- 🗑️ **Delete URLs** (only by the URL owner)  
- 🧾 **Input validation** using `zod`

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js + Express.js** | Server-side framework |
| **Drizzle ORM** | Database ORM |
| **PostgreSQL** | Database |
| **JWT (jsonwebtoken)** | Authentication |
| **Zod** | Request body validation |
| **Nanoid** | Generates short unique URL codes |
| **Nodemon** | Hot reloading during development |

---

## ⚙️ Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/url-shortener.git
cd url-shortener
