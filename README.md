# 🏠 Room Bazar

**Room Bazar** is a full-stack web platform built to simplify the room hunting and roommate-finding experience in Nepal. Whether you're a student, working professional, or property owner, Room Bazar provides everything from listing and booking rooms to chatting with potential roommates — all in one place.

🔗 **Live Demo**: [https://room-bazar.vercel.app](https://room-bazar.vercel.app/)

---

##  Features

- 🏘️ **Room Listing**
  - Add rooms with rent, location, description, and media (images/videos).
- 📅 **Room Booking**
  - Easy and direct booking process — user-friendly interface.
  - Optional agent involvement in room deals.
- 💰 **Integrated Payments**
  - Support for **eSewa** and **Khalti** payment gateways (currently in test mode).
- 🧑‍🤝‍🧑 **Roommate Finder**
  - Filter by **gender**, **location**, and **profession**.
- 💬 **In-App Messaging**
  - Chat with potential roommates or room owners without leaving the platform.
- 🔐 **Authentication**
  - Login and signup support, including protected routes for logged-in users (JWT auth).
- 🔍 **Search & Filters**
  - Search rooms or roommates based on custom filters (age, gender, location, etc.).

---

## 🧪 Current Status

- ✅ Roommate & chat modules functional.
- ⚙️ APIs under testing.
- 💸 Payment gateways being tested using the credentials below.

### 🔐 Test Payment Credentials

#### 🟢 eSewa (Testing)
- ID: `9806800001-5`
- Password: `Nepal@123`
- MPIN: `1122`
- OTP: `123456`

#### 🟣 Khalti (Testing)
- ID: `9800000000-5`
- MPIN: `1111`
- OTP: `987654`

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Others**:
  - Cloudinary (for media uploads),
  - Vercel (hosting frontend),
  - Render (for backend deployment)

---

Room-Bazar/
│
├── Backend/
│   ├── public/                     # Static files (if needed)
│   ├── src/
│   │   ├── controllers/            # Business logic for each route
│   │   ├── middlewares/           # Custom middlewares (auth, error handling, etc.)
│   │   ├── models/                 # Mongoose models/schemas
│   │   ├── routes/                 # API route definitions
│   │   ├── services/               # External API wrappers, business services
│   │   ├── utils/                  # Utility functions (validators, formatters, etc.)
│   │   ├── constants/              # App-wide constants 
│   │   └── index.js                # Main server entry point
│   └── .env.sample                 # Sample environment variables
│
├── Frontend/
│   ├── public/                     # HTML template and public assets
│   ├── src/
│   │   ├── assets/                 # Images, icons, fonts, etc.
│   │   ├── components/    
│   │   ├── pages/                  # Route-level pages
│   │   ├── services/               # API calls (Axios instances, etc.)
│   │   ├── store/                  # State management (Redux)
│   │   └── App.jsx                 # Root component
│   └── .env.sample                 # Frontend environment variables
│
├── demo/                           # Screenshots and media for README
│
├── README.md


## ⚙️ Installation
# Backend
```bash
cd Backend
npm install
npm run dev
```
#Frontend
```bash
cd Backend
npm install
npm run dev
```

## Want to Contribute?
1. Fork the repository 
2. clone forked repo
```bash
    git clone https://github.com/your-username/RoomBazar.git
    cd RoomBazar
```

3. switch to your new branch(not main)
```bash
    git switch -c feature_add
```
4. Make changes in your local environment (VS Code, etc.).

5. Stage and commit your changes:
```bash
    git add .
    git commit -m "Add your message"
    git push origin feature/your-feature-name
```
6. Go to GitHub and click "Compare & pull request" from your fork.

7. done? i will review and  accept your request 
8. to do further contributioin, simply git pull or git fetch and git merge in your local ide(eg:vs code in your local repo)
   
🔄 For future contributions, always 
git pull or git fetch and merge the latest changes from the original repo to stay up-to-date.


---

💬 Feedback Welcome!
Your feedback is super helpful. Whether it’s a bug, feature idea, or improvement, feel free to open an issue or PR.

🧠 What do you think is missing? What would make this platform more helpful for people like you?
Open an [issue](https://github.com/devmahesh-5/Room-Bazar/issues) or share your thoughts in discussions!

👤 Author
Mahesh Bhandari
📍 Pulchowk Engineering Campus
🔗 [GitHub](https://github.com/devmahesh-5)