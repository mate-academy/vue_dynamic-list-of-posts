# Vue Dynamic List of Posts

A modern, responsive, and interactive single-page application built with Vue 3 and Vite. The application allows users to register/log in via email to manage their personal posts and comments in a sleek dashboard styled with Bulma CSS and Font Awesome.

## Features

- **User Authentication**: Simple email lookup and registration flow that persists sessions locally.
- **Posts Management**: Full CRUD operations for user posts (view posts list, create new posts, edit titles and contents, and delete posts).
- **Slide-out Sidebar**: Smooth sliding transitions on desktop screens for viewing details and editing posts.
- **Comments Section**: Load, add, and delete comments for any post.
- **Optimistic UI Deletion**: Comments are removed instantly from the user interface while deletion occurs in the background, rolling back state gracefully on network failure.
- **Field Validation**: Inline, real-time error handling on submit with clean recovery on field change.

## Tech Stack

- **Framework**: Vue 3 (Composition API using `<script setup>`)
- **Build Tool**: Vite
- **Styling**: Bulma CSS Framework
- **Icons**: Font Awesome v6

## Getting Started

### Installation

1. Clone this repository to your local machine.
2. Install project dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server locally:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to view the application.

### Production Build

Build the project for production:
```bash
npm run build
```
The output files will be generated in the `dist` directory.
