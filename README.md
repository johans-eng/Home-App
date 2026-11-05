# 🏠 Home App

A family home management system with:
- **iOS Phones** (PWA) - Set status, add appointments, todos, shopping items
- **Android Tablet** (Native Kotlin) - Beautiful dashboard displaying all family data
- **Server** (Node.js) - Runs on your old laptop, syncs everything in real-time

## 📁 Project Structure

```
Home-App/
├── server/              # Node.js backend
├── web-client/          # React PWA for iOS phones
└── android-tablet/      # Native Kotlin + Jetpack Compose
```

---

## 🚀 Quick Start

### 1. Start the Server

```bash
cd server
npm install
npm run dev
```

The server will start at `http://localhost:3000`

### 2. Find Your Computer's IP Address

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" under your WiFi/Ethernet adapter (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

### 3. Set Up iOS Phones (PWA)

1. Open Safari on your iPhone
2. Go to `http://YOUR_IP:3000` (e.g., `http://192.168.1.100:3000`)
3. Tap the Share button → "Add to Home Screen"
4. Open the app from your home screen
5. Enter your name to create a profile

### 4. Set Up Android Tablet (Native App)

**Option A: Build from Android Studio**
1. Open the `android-tablet` folder in Android Studio
2. Let Gradle sync
3. Connect your tablet via USB or use WiFi debugging
4. Click Run

**Option B: Build APK**
```bash
cd android-tablet
./gradlew assembleDebug
```
The APK will be at `app/build/outputs/apk/debug/app-debug.apk`

Transfer to tablet and install.

---

## 📱 Features

### Phone App (PWA)
- **Status Toggle** - Mark yourself as Home or Away
- **Appointments** - Add calendar events with date/time
- **To-Do List** - Create and check off tasks
- **Shopping List** - Add items to a shared list
- **Profile** - Set your name (shown on all your entries)

### Tablet Dashboard (Native)
- **Who's Home** - See who's home and who's away
- **Today's Schedule** - All appointments for today
- **To-Do List** - Family task list with checkboxes
- **Shopping List** - Shared shopping list
- **Activity Feed** - Real-time updates of all actions

---

## 🔧 Configuration

### Server Port
Edit `server/src/index.ts`:
```typescript
const PORT = process.env.PORT || 3000;
```

### Remote Access (Outside Home Network)

To access from anywhere, set up one of these:

#### Option 1: Cloudflare Tunnel (Recommended)
1. Create a free Cloudflare account
2. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
3. Run: `cloudflared tunnel --url http://localhost:3000`
4. Use the provided URL on your devices

#### Option 2: Tailscale
1. Install Tailscale on server and all devices
2. Use the Tailscale IP of your server

---

## 🛠️ Development

### Server
```bash
cd server
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Web Client
```bash
cd web-client
npm install
npm run dev      # Development server at http://localhost:5173
npm run build    # Build for production (output in dist/)
```

### Android Tablet
Open in Android Studio and use the built-in tools, or:
```bash
cd android-tablet
./gradlew assembleDebug    # Debug APK
./gradlew assembleRelease  # Release APK (needs signing)
```

---

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users` | GET, POST | List/create users |
| `/api/users/:id/status` | PUT | Update home/away status |
| `/api/appointments` | GET, POST | List/create appointments |
| `/api/appointments/today` | GET | Today's appointments |
| `/api/todos` | GET, POST | List/create todos |
| `/api/todos/:id/toggle` | PUT | Toggle todo completion |
| `/api/shopping` | GET, POST | List/create shopping items |
| `/api/shopping/:id/toggle` | PUT | Toggle item checked |
| `/api/activity` | GET | Activity log |
| `/api/health` | GET | Server health check |

---

## 🔌 WebSocket Events

The server uses Socket.IO for real-time updates:

**From Server:**
- `initial_state` - Full state on connection
- `user_created`, `user_updated`, `user_status_changed`
- `appointment_created`, `appointment_updated`, `appointment_deleted`
- `todo_created`, `todo_updated`, `todo_deleted`
- `shopping_created`, `shopping_updated`, `shopping_deleted`
- `activity_created`

---

## 📦 Tech Stack

| Component | Technology |
|-----------|------------|
| Server | Node.js, Express, Socket.IO, SQLite |
| PWA | React, TypeScript, Vite, Tailwind CSS |
| Android | Kotlin, Jetpack Compose, Material 3, Retrofit |

---

## 🔒 Security Notes

- This app is designed for home/local network use
- No authentication is implemented (all family members trust each other)
- If exposing to internet, consider adding authentication
- The SQLite database is stored in `server/data/home-app.db`

---

## 📄 License

MIT - Feel free to modify and use as you like!
