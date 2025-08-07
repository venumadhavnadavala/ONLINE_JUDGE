# 💻 CodeVM — Your Scalable Online Judge

> **CodeVM** is a robust, full-stack online judge platform designed for competitive programming. It provides a secure, scalable, and intuitive environment for users to solve problems, compete in contests, and track their progress.

---

## 🚀 Features

### ✅ Multi-Language Support
* C++
* Python
* Java

### 🤖 AI-Powered Code Review
* Get instant, contextual feedback on your code directly in the editor before submission.
* The AI review feature helps enhance code quality and suggests improvements, acting as a virtual mentor.

### 📈 User Dashboard & Analytics
* A personalized dashboard welcomes users and displays key performance stats.
* Track total submissions, accepted solutions, problems solved, and view a breakdown by difficulty.
* View your recent submission activity and history at a glance.

### 🔐 Secure & Isolated Code Execution
* All code submissions are executed inside **Docker containers** to create a secure sandbox environment.
* This prevents malicious code from accessing system-level files or interfering with the main application.
* Strict resource limits on CPU and memory are enforced on every submission to ensure fairness and stability.

### 📚 Comprehensive Problem & Contest Platform
* A rich problem list that can be filtered by difficulty (Easy, Medium, Hard) and tags (e.g., array, dp, hash).
* Participate in **upcoming coding contests** with defined start and end times.
* Admins have a dedicated interface to manage problems and test cases, ensuring a challenging and fair environment.

### 🎨 UI Customization
* Easily switch between a sleek **dark mode** and a clean **light mode** to suit your preference.

---

## 🔐 Authentication & Authorization

* Secure user and admin roles with separate login flows.
* **JWT (JSON Web Tokens)** are used for managing user sessions upon successful login.
* Tokens are stored in **local storage** to maintain authentication state across the application.
* **Admin Panel**:
    * A completely separate interface for admins to perform privileged actions.
    * Admins can add/edit problems, manage test cases, and create new contests.

---

## ⚙️ Tech Stack

| Category         | Technology                               |
|------------------|------------------------------------------|
| 🌐 Frontend      | React.js (Vercel deployment)             |
| 🧠 Backend       | Node.js + Express.js                     |
| 📦 Database      | MongoDB                                  |
| 🐳 Containers      | Docker                                   |
| 🔒 Security      | JWT + Password Hashing + Docker Isolation |
| ☁️ Hosting        | AWS EC2 + Nginx + Certbot SSL            |

---

## 📝 Upcoming Features

* **Advanced Analytics**: A detailed analytics dashboard to track submission trends, problem difficulty statistics, and user growth.
* **Plagiarism Detection**: Integration of a similarity checker like MOSS to ensure academic integrity during contests.
* **Team Contests**: Allowing users to form teams and participate in collaborative coding competitions.

---
👨‍💻 Developed By
**Venu Madhav Nadavala**
