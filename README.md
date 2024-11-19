# Simple Blog Application
[Demo](https://iyehorova.github.io/vue_dynamic-list-of-posts/)

This is a basic blog application built with Vue 3 using the Composition API. The app connects to an API to manage user registration, posts, and comments.

## Features
- **User Registration:**

    - Upon entering an email, the app checks if the user is registered.

   - If the email is not in the database, the app prompts the user to enter a name for quick registration, without requiring a password.

- **Posts:**

    - After login or registration, the user sees a list of their posts.
    - New users start with an empty post list and can add new posts using a form with title and text fields.
    - Posts can be **added**, **edited**, or **deleted**.

- Comments:

    - Users can add or delete comments for each post.

### Usage
1. Enter your email on the login screen.
2. If the email is not registered, provide your name to complete registration.
3. After logging in, you’ll be redirected to the posts page:
    - Add new posts with the "Add Post" button.
    - Edit or delete existing posts.
4. Open a post to add or remove comments as needed.

### Technologies Used
**Vue 3 | Composition API**
