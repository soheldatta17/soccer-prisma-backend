# Soccer Team Management API

A comprehensive REST API for managing professional soccer teams, players, and staff. Built with Node.js, TypeScript, and Prisma, this system provides everything needed to manage soccer teams digitally.

## 🚀 Features

- Complete Soccer Team Management
  - Create and manage multiple teams
  - Track team details (location, league, founding year)
  - Manage team rosters and squad numbers
- Player Management
  - Player profiles with positions and jersey numbers
  - Track player roles and assignments
  - Transfer players between teams
- Staff Management
  - Multiple staff roles (Manager, Head Coach, Assistant Coach)
  - Role-based access control
  - Staff assignment and management
- Authentication & Security
  - Secure user authentication
  - Role-based permissions
  - JWT token authentication
- Technical Features
  - RESTful API architecture
  - Pagination support
  - Input validation
  - Comprehensive error handling
  - PostgreSQL database

## 📋 Prerequisites

- [Node.js](https://nodejs.org) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org) database

## 🔧 Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd soccer-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/soccer_manager"
JWT_SECRET="your-secret-key"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the server:
```bash
npm start
```

The server will start running on `http://localhost:3000`

## 📚 API Documentation

### Authentication APIs

#### 1. Sign Up
- **Endpoint:** `POST /v1/auth/signup`
- **Description:** Register a new user (player, staff, or manager)
- **Request Body:**
  ```json
  {
    "name": "Kylian Mbappe",
    "email": "mbappe@example.com",
    "password": "securepassword123"
  }
  ```
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "usr_123abc456def",
        "name": "Kylian Mbappe",
        "email": "mbappe@example.com",
        "created_at": "2024-03-06T08:57:23.382Z"
      },
      "meta": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
  ```

#### 2. Sign In
- **Endpoint:** `POST /v1/auth/signin`
- **Description:** Authenticate and receive access token
- **Request Body:**
  ```json
  {
    "email": "mbappe@example.com",
    "password": "securepassword123"
  }
  ```
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "usr_123abc456def",
        "name": "Kylian Mbappe",
        "email": "mbappe@example.com",
        "created_at": "2024-03-06T08:57:23.382Z"
      },
      "meta": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
  ```

### Team APIs

#### 1. Create Team
- **Endpoint:** `POST /v1/team`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Create a new soccer team
- **Request Body:**
  ```json
  {
    "name": "Manchester United",
    "location": "Manchester, England",
    "league": "Premier League",
    "founded": 1878
  }
  ```
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "team_123abc456def",
        "name": "Manchester United",
        "location": "Manchester, England",
        "league": "Premier League",
        "founded": 1878,
        "created_at": "2024-03-06T08:57:23.382Z",
        "owner_id": "usr_123abc456def"
      }
    }
  }
  ```

#### 2. Get All Teams
- **Endpoint:** `GET /v1/team`
- **Description:** List all teams with pagination
- **Query Parameters:** 
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": [
        {
          "id": "team_123abc456def",
          "name": "Manchester United",
          "location": "Manchester, England",
          "league": "Premier League",
          "founded": 1878
        },
        {
          "id": "team_789xyz012uvw",
          "name": "Liverpool FC",
          "location": "Liverpool, England",
          "league": "Premier League",
          "founded": 1892
        }
      ],
      "meta": {
        "total": 20,
        "page": 1,
        "limit": 10,
        "total_pages": 2
      }
    }
  }
  ```

#### 3. Get Team Details
- **Endpoint:** `GET /v1/team/:teamId`
- **Description:** Get detailed information about a specific team
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "team_123abc456def",
        "name": "Manchester United",
        "location": "Manchester, England",
        "league": "Premier League",
        "founded": 1878,
        "owner_id": "usr_123abc456def",
        "created_at": "2024-03-06T08:57:23.382Z",
        "stats": {
          "total_players": 25,
          "total_staff": 10
        }
      }
    }
  }
  ```

#### 4. Get Team Players
- **Endpoint:** `GET /v1/team/:teamId/players`
- **Description:** Get all players in a team
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": [
        {
          "id": "player_123abc",
          "name": "Marcus Rashford",
          "position": "Forward",
          "jersey_number": 10,
          "joined_at": "2024-03-06T08:57:23.382Z"
        },
        {
          "id": "player_456def",
          "name": "Bruno Fernandes",
          "position": "Midfielder",
          "jersey_number": 8,
          "joined_at": "2024-03-06T08:57:23.382Z"
        }
      ],
      "meta": {
        "total": 25,
        "active": 25
      }
    }
  }
  ```

### Player APIs

#### 1. Add Player to Team
- **Endpoint:** `POST /v1/player`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Add a player to a team with position and number
- **Request Body:**
  ```json
  {
    "teamId": "team_id",
    "roleId": "player_role_id",
    "position": "Forward",
    "jerseyNumber": 7
  }
  ```
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "player_123abc",
        "team_id": "team_id",
        "role_id": "player_role_id",
        "position": "Forward",
        "jersey_number": 7,
        "created_at": "2024-03-06T08:57:23.382Z",
        "status": "active"
      }
    }
  }
  ```

#### 2. Update Player Details
- **Endpoint:** `PUT /v1/player/:playerId`
- **Headers:** `Authorization: Bearer <token>`
- **Description:** Update player information
- **Request Body:**
  ```json
  {
    "position": "Forward",
    "jerseyNumber": 10
  }
  ```
- **Sample Response:**
  ```json
  {
    "status": true,
    "content": {
      "data": {
        "id": "player_123abc",
        "position": "Forward",
        "jersey_number": 10,
        "updated_at": "2024-03-06T08:57:23.382Z"
      }
    }
  }
  ```

### Soccer-Specific Features

#### Player Positions
Supported soccer positions:
- Forward
- Midfielder
- Defender
- Goalkeeper

#### Team Roles
The system includes soccer-specific roles:
- Team Manager: Full team management access
- Head Coach: Player and tactical management
- Assistant Coach: Training and player development
- Team Captain: Team leadership and communication
- Player: Basic team access

Each role has specific permissions aligned with soccer team hierarchy.

## 🔒 Authentication

Protected routes require JWT authentication:
```
Authorization: Bearer <token>
```

## 📝 Response Format

API responses follow this format:
```json
{
  "status": true,
  "content": {
    "data": {
      // Response data
    },
    "meta": {
      // Metadata (pagination, tokens)
    }
  }
}
```

## 🛠️ Error Handling

Error responses:
```json
{
  "status": false,
  "error": "Error message"
}
```

Common error responses:
```json
{
  "status": false,
  "error": "User already exists"
}
```

```json
{
  "status": false,
  "error": "Invalid credentials"
}
```

```json
{
  "status": false,
  "error": "Unauthorized - Invalid or expired token"
}
```

```json
{
  "status": false,
  "error": "Resource not found"
}
```

## 📦 Technology Stack

- **Backend:** Node.js with TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT
- **API:** RESTful architecture

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sohel Datta**

* GitHub: [@soheldatta17](https://github.com/soheldatta17)
* Email: soheldatta17@gmail.com

## ©️ Copyright

Copyright © 2024 [Sohel Datta](https://github.com/soheldatta17). All rights reserved.
