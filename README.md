# Vue Dynamic List of Posts

- LIVE DEMO: https://VictorKomara.github.io/vue_dynamic-list-of-posts/

Implement the App with ability to show posts of a current logged-in user.
The user should be able to create a new post with their userId. Each post can
be opened in the sidebar with its comments, can be edited and deleted. There should delete a comment and a
form to add new comments. For communication with the server, use the Posts and Users [Mate API](https://mate-academy.github.io/fe-students-api).

> Here is [the working version](https://mate-academy.github.io/vue_dynamic-list-of-posts/#/)

1. Learn the `.html` files to get all needed layouts;
   + Bulma is required to have all styles
2. Initially the `App` shows the `Posts table` and `Create new post` button

   + show the `<Loader>` while waiting for the API response;
   + show an error notification if `posts` loading fails;
   + if the user has no posts show the `No posts yet` notification.

3. Add the `Sidebar--open` class to the sidebar when user click on `Create new post`;

   + the form for new post should be appear there immediately;
   + add validation to the fields;
   + when user click on `Create` component with post details and comments should be appear there immediately ;

4. In the `Post preview` user should see `edit` and `delete` buttons;

   + When user click on `Delete`, post should be deleted and sidebar close;
   + When user click on `Edit` show edit post form;
   + When user click on `Save` in edit mode - show post preview in the sidebar;

5. Add the `Sidebar--open` class to the sidebar when a post is selected;
   + the post details should appear there immediately;
   + the post commnets should be loaded from the API;
   + the `Loader` is shown before comments are loaded;
   + `CommentsError` notification is show on loading error;
   + `NoComments` message is shown if the post does not have comments yet;
6. Show the `Write a comment` button below the comments
   + after click hide the button and show the form to add new comment;
   + the form stays visible until the other post is opened;
   + the form should be implemented as a separate component;
7. The form requires an author's name and email and a comment text.
   + show errors only after the form is submitted;
   + remove an error on the field change;
   + keep the `name` and `email` after the successful submit but clear a comment text;
   + The `Clear` button should also clear all errors;
   + Add the `is-loading` class to the submit button while waiting for a response;
   + Add the new comment received as a response from the `API` to the end of the list;
7. Implement comment deletion
   + Delete the commnet immediately not waiting for the server response to improve the UX.
8. (\*) Handle `Add` and `Delete` errors so the user can retry
