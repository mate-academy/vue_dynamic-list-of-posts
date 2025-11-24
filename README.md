# Vue Dynamic List of Posts

A Vue.js application for managing posts and comments using the [Mate API](https://mate-academy.github.io/fe-students-api).

## Features

- 🔐 User authentication and registration
- 📝 Create, edit, and delete posts
- 💬 Add and delete comments
- 🎨 Modern UI with Bulma CSS
- ⚡ Fast and convenient data management

## Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool
- **Bulma CSS** - Modern CSS framework (via CDN)
- **Font Awesome** - Icons (via CDN)

## Installation

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # Vue components
│   ├── Header.vue      # Header with user info
│   ├── LoginForm.vue   # Login form
│   ├── RegistrationForm.vue  # Registration form
│   ├── PostList.vue    # Posts list
│   ├── PostForm.vue    # Create/edit post form
│   ├── PostPreview.vue # Post preview
│   ├── Sidebar.vue     # Sidebar panel
│   ├── CommentItem.vue # Comment item
│   ├── CommentForm.vue # Add comment form
│   └── Loader.vue      # Loading indicator
├── services/           # API services
│   ├── httpClient.js   # HTTP client
│   └── api.js          # API methods
├── App.vue             # Main component
├── main.js             # Entry point
└── store.js            # Global state
```

## How to Use

1. **Login/Registration**
   - Enter your email to login
   - If user not found, registration form will appear

2. **Working with Posts**
   - Click "Add New Post" to create a new post
   - Click "Open" to view a post
   - In view mode, edit and delete buttons are available

3. **Working with Comments**
   - Open a post
   - Click "Write a comment"
   - Fill the form and click "Add Comment"
   - To delete a comment, click the "×" button

## API

The project uses [Mate Students API](https://mate-academy.github.io/fe-students-api):

- `GET /users?email={email}` - get user
- `POST /users` - create user
- `GET /posts` - get all posts
- `POST /posts` - create post
- `PATCH /posts/{id}` - update post
- `DELETE /posts/{id}` - delete post
- `GET /comments?postId={id}` - get post comments
- `POST /comments` - create comment
- `DELETE /comments/{id}` - delete comment

## License

MIT
