# 🚀 ServDashboard

Application complète de monitoring serveur temps réel (Backend Go + Frontend React 19 + Capacitor).

## 📁 Architecture du projet

```
servdashboard/
├── server/                 # Backend Go (Gin Framework + gopsutil)
│   ├── main.go            # Serveur REST avec CORS, collecteur temps réel non-bloquant
│   ├── go.mod
│   └── go.sum
└── dashboard/              # Frontend React 19 (Vite + Capacitor)
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx                      # Barre d'état, ping, cadence, sélecteur mobile
    │   │   ├── ServerStats/                    # 👈 PANEL GAUCHE (Stats serveur)
    │   │   │   ├── ServerStatsPanel.jsx        # Assemblage des cartes de stats
    │   │   │   ├── QuickOverview.jsx           # Hostname, OS, Uptime, Load average
    │   │   │   ├── CPUCard.jsx                 # Jauge CPU, détail par cœur, sparkline
    │   │   │   ├── MemoryCard.jsx              # RAM utilisée/disponible, Swap, sparkline
    │   │   │   ├── DiskCard.jsx                # Espace disque utilisé/libre/total
    │   │   │   ├── NetworkCard.jsx             # Débits Upload/Download temps réel
    │   │   │   └── RuntimeCard.jsx             # Moteur Go, goroutines, temps d'activité
    │   │   ├── RightSpace/                     # 👉 PANEL DROIT (Espace pour la suite)
    │   │   │   ├── RightSpacePanel.jsx         # Conteneur modulaire extensible
    │   │   │   ├── QuickActionsWidget.jsx      # Actions rapides (/ping, rafraîchir, copier)
    │   │   │   ├── ServicesWidget.jsx          # Surveillance des services & ports
    │   │   │   ├── NotesWidget.jsx             # Bloc-notes serveur auto-enregistré
    │   │   │   └── FutureWidgetCard.jsx        # Espace réservé pour vos futurs widgets
    │   │   ├── SettingsModal.jsx               # Configuration de l'URL du serveur
    │   │   └── common/                         # Sparklines SVG, barres de progression, badges
    │   ├── hooks/                              # useServerStats (polling résilient & historique)
    │   └── utils/                              # Formateurs d'octets, débits et durées
```

## 🛠️ Démarrage rapide

### 1. Lancer le serveur Go (port 8080)
```bash
cd server
go run main.go
```

Endpoints disponibles :
- `GET /api/stats` : Métriques système détaillées en JSON (CPU, RAM, Disque, Réseau, Host, Uptime, Go Runtime)
- `GET /stats` : Endpoint rétrocompatible
- `GET /ping` : Health check (`{"message":"pong"}`)

### 2. Lancer le frontend React Dashboard
```bash
cd dashboard
npm run dev
```
Accédez à l'interface sur `http://localhost:5173`.

### 3. Build & synchronisation Capacitor (Mobile / Android)
```bash
cd dashboard
npm run build
npx cap sync
```

## 📱 Utilisation sur mobile & réseau local
Pour surveiller votre serveur depuis votre smartphone :
1. Lancez le serveur Go.
2. Ouvrez l'application web ou Capacitor sur votre mobile.
3. Cliquez sur l'icône **⚙️ Paramètres** en haut à droite.
4. Renseignez l'adresse IP locale de votre machine (ex: `http://192.168.1.50:8080`).
