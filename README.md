# Music Social Media App

A modern full-stack social media platform built with Laravel and React. Share posts, connect with others, and engage with a vibrant community.

## Features

### Authentication
- **Email/Password Authentication** - Secure registration and login
- **Google OAuth Integration** - Quick sign-in with Google account
- **Email Verification** - Verify user emails on registration
- **Password Reset** - Secure password recovery via email

### Social Networking
- **Posts** - Create, update, and delete posts with captions and images
- **Likes** - Like and unlike posts from other users
- **Comments** - Add, edit, and delete comments on posts
- **Follow System** - Follow/unfollow users and view your following list

### User Profiles
- **Customizable Profiles** - Unique usernames, bio descriptions
- **Avatar & Banner** - Upload custom profile images and banners
- **User Activity** - View posts by specific users
- **Profile Pages** - Clean, responsive profile views

### Performance
- **Redis Caching** - Fast data retrieval with Redis cache layer
- **Optimized Queries** - N+1 query prevention and batch loading
- **Pagination** - Efficient feed loading with paginated results

## Tech Stack

### Backend
- **Laravel 12.0** - PHP framework
- **PHP 8.2+** - Modern PHP
- **Laravel Sanctum** - SPA authentication
- **Laravel Socialite** - OAuth integration
- **Predis** - Redis client for PHP

### Frontend
- **React 19.2.0** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS
- **Vite 7.0.7** - Lightning-fast build tool
- **Wouter** - Lightweight SPA routing
- **Ky** - Modern HTTP client

### Database & Caching
- **SQLite** - Default database (configurable to MySQL/PostgreSQL)
- **Redis** - High-performance caching and session storage

### Infrastructure
- **Docker** - Fully containerized with Laravel Sail
- **MySQL** - Optional database (via Docker)
- **Pest PHP** - Modern testing framework

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)
- Redis (optional, for caching)

## Installation

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-social-media-app
   ```

2. **Install dependencies and setup**
   ```bash
   composer setup
   ```
   This command will:
   - Install PHP dependencies
   - Copy `.env.example` to `.env`
   - Generate application key
   - Run database migrations
   - Install Node.js dependencies
   - Build frontend assets

3. **Configure environment**

   Edit `.env` file for your environment:
   ```env
   # Database (SQLite by default)
   DB_CONNECTION=sqlite

   # Redis (optional, for caching)
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback
   ```

4. **Run the development server**
   ```bash
   composer dev
   ```
   This runs three services concurrently:
   - Laravel server (port 8000)
   - Queue worker (background jobs)
   - Vite dev server (port 5173 with HMR)

5. **Access the application**

   Open your browser to `http://localhost:8000`

### Option 2: Docker (Laravel Sail)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-social-media-app
   ```

2. **Install dependencies via Docker**
   ```bash
   docker run --rm \
       -u "$(id -u):$(id -g)" \
       -v "$(pwd):/var/www/html" \
       -w /var/www/html \
       laravelsail/php83-composer:latest \
       composer install --ignore-platform-reqs
   ```

3. **Start Docker containers**
   ```bash
   ./vendor/bin/sail up -d
   ```
   This starts:
   - Laravel application (port 80)
   - MySQL database (port 3306)
   - Redis (port 6379)
   - Vite dev server (port 5173)

4. **Setup application**
   ```bash
   ./vendor/bin/sail artisan key:generate
   ./vendor/bin/sail artisan migrate
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run build
   ```

5. **Access the application**

   Open your browser to `http://localhost`

## Configuration

### Redis Setup

Redis is used for caching user metadata and follow relationships to improve performance.

**Local Redis:**
```bash
# Install Redis (Ubuntu/Debian)
sudo apt-get install redis-server

# Install Redis (macOS)
brew install redis
brew services start redis
```

**Docker Redis:**
Redis is automatically included when using Laravel Sail.

**Enable Redis Caching:**
```env
# In .env file
CACHE_STORE=redis
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Google OAuth Setup

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:8000/auth/google/callback`
5. Update `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback
   ```

### Email Configuration

For production, configure an email service:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

## Development

### Running Tests
```bash
composer test
```

### Code Style
```bash
./vendor/bin/pint
```

### Database Seeding
```bash
php artisan db:seed
```

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## Project Structure

```
music-social-media-app/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # API controllers
│   │   ├── Requests/          # Form validation
│   │   ├── Responses/         # Response DTOs
│   │   └── Middleware/        # Custom middleware
│   ├── Models/                # Eloquent models
│   ├── Services/              # Business logic layer
│   └── Mail/                  # Email templates
├── resources/
│   ├── js/
│   │   ├── views/             # React pages
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React contexts
│   │   ├── services/          # API services
│   │   └── model/             # TypeScript types
│   └── css/                   # Stylesheets
├── routes/
│   └── web.php                # API & web routes
├── database/
│   ├── migrations/            # Database migrations
│   └── factories/             # Model factories
└── tests/                     # Pest PHP tests
```

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /auth/google` - Google OAuth redirect
- `GET /auth/google/callback` - Google OAuth callback

### Posts
- `GET /api/posts` - Get paginated posts
- `POST /api/posts` - Create post
- `PUT /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post

### Comments
- `GET /api/posts/{id}/comments` - Get post comments
- `POST /api/posts/{id}/comments` - Create comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Likes
- `POST /api/posts/{id}/like` - Like/unlike post

### Users
- `GET /api/users/{username}` - Get user profile
- `PUT /api/user/avatar` - Update avatar
- `PUT /api/user/banner` - Update banner
- `PUT /api/user/password` - Change password

### Follow
- `POST /api/users/{id}/follow` - Follow/unfollow user
- `GET /api/following` - Get following list

## App preview

<img width="1709" height="940" alt="Screenshot 2025-11-10 082439" src="https://github.com/user-attachments/assets/83edf3c9-d82f-4065-9152-0d730e53824d" />

<img width="1700" height="925" alt="Screenshot 2025-11-10 082532" src="https://github.com/user-attachments/assets/91807082-c65d-490f-9ff4-3eab9a348d50" />

<img width="1710" height="961" alt="Screenshot 2025-11-10 083401" src="https://github.com/user-attachments/assets/ae796e70-f7b8-4cd0-8657-627bd0da4192" />

<img width="1705" height="923" alt="Screenshot 2025-11-10 083518" src="https://github.com/user-attachments/assets/3a3d2d6e-1b59-43a0-98a5-d2dea341d5ec" />

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
