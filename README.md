# ChatUp	



# Quick Compo

<img src="/Users/enriquecoscarelli/Downloads/minilogo.png" alt="minilogo" style="zoom:75%;" />

## Description

***ChatUp*** it's a Chatting app.

***dataBASE*** has been developed as a part of the final project in [Ironhack](https://www.ironhack.com/es/desarrollo-web/barcelona?utm_source=google-sea&utm_medium=cpc&utm_campaign=BCN_app_campus_brand_GA_ES&utm_term={keywords}&gclid=Cj0KCQjwo6D4BRDgARIsAA6uN19LKsx0pvTH-iUz-RfrGakzau9RGdhJaixWuX32X92njICzz66RYbAaAncuEALw_wcB) Web Developement bootcamp.

## User Stories

- **Signup:** As a user I can sign up in the platform so that I can start playing into competition
- **Login:** As a user I can login to the platform so that I can log my exit points
- **Logout:** As a user I can logout from the platform so no one else can use it
- **Send A Request:** As a user I can send a friend request to other users
- **Replay to a Request:** As a user I can replay to a friend request by either accepting or regecting it.
- **Remove a friend:** As a user I can remove a friend from my friend list
- **Create a Group:** As a user I can create a chatting group
- **Add to a group:** As a user I can add another user to a group i'm in
- **Remove from a Group:** As a user (group creator) I can remove another user from my group
- **Leave a Group:** As a user I can leave a group
- **Delete a Group:** As a user (group creator) I can delete my chat group

## Backlog

User profile:

- see my profile
- see exit point
- 



# Client / Frontend

## React Router Routes (React App)

| Path                | Component        | Permissions                | Behavior                                                     |
| ------------------- | ---------------- | -------------------------- | ------------------------------------------------------------ |
| `/`                 | HomePage         | public `<Route>`           | Home page                                                    |
| `/signup`           | SignupPage       | anon only `<AnonRoute>`    | Signup form, link to login, navigate to homepage after signup |
| `/login`            | LoginPage        | anon only `<AnonRoute>`    | Login form, link to signup, navigate to homepage after login |
| `/profile`          | ProfilePage      | user only `<PrivateRoute>` | Profile screen, link to homepage                             |
| `/conversation/:id` | ConversationPage | user only `<PrivateRoute>` | Conversation screen, link to homepage                        |
| `/group/:id`        | GroupPage        | user only `<PrivateRoute>` | Group screen, link to homepage                               |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |
|                     |                  |                            |                                                              |

## Components

- HomePage
- LoginPage
- SignupPage
- ProfilePage
- ConversationPage
- GroupPage
- Navbar
- Footer

## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser() // synchronous
- User Service
  - user.detail(id)
- Friends Service
  - friends.get()
  - friends.sendRequest(id)
  - friends.replayToRequest(id)
  - friends.remove(id)
- Group Service
  - group.get()
  - group.create()
  - group.delete(id)
  - group.deleteMember(id)
  - group.addMember(id)
  - group.leave(id)

# Server / Backend

## Models

User model

```
{
    userName: {
        type: String,
        unique:true,
        trim:true,
        required: [true,'Please enter a user name'],
        validate:[isAlphanumeric,"username should be contain only letters and numbers"]
    }
    ,
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique:true,
        trim:true,
        lowercase: true,
        validate:[isEmail,"email should be in a correct format"]
    }
    ,
    password: {
        type: String,
        required: [true,'Please enter a password'],
        minlength: [6,"password should be larger than 5"],
        maxlength: [20,"password should be smaller than 21"]
    }
    ,
    friends: [{
        type: Schema.Types.ObjectId, ref: 'friendRequests'
    }]
    ,
    groups: [{
        type: Schema.Types.ObjectId, ref: 'groups'
    }]
}
```

Friend model

```
{
    from: {
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }
    ,
    to: {
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }
    ,
    status: {
        type: Number,
        enums: [
            0,    //'add friend',
            1,    //'requested',
            2,    //'pending',
            3,    //'friends'
        ]
      }
}
```



## Backend routes

| HTTP Method | URL                  | Request Body                | Success status | Error Status | Description                                                  |
| ----------- | -------------------- | --------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/me`           |                             | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`       | {name, email, password}     | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`        | {username, password}        | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`       | (empty)                     | 204            | 400          | Logs out the user                                            |
| POST        | /api/user            | {userName, email, password} |                |              | Used to create a new user.                                   |
| DELETE      | /api/user/           | {myID}                      |                |              | Used to delete the user's account.                           |
| GET         | /api/user            |                             |                |              |                                                              |
| GET         | /api/friend          |                             |                |              |                                                              |
| POST        | /api/friend          | {from,to}                   |                |              | Used to send a friend request where "from" is the sender's ID and "to" is the receiver's ID |
| PUT         | /api/friend          | {replay,from,to}            |                |              | Used to replay by "accept" or "reject" to a friend request that is sent to userID "to" from a userID "from" |
| DELETE      | /api/friend          | {from,to}                   |                |              | Used to delete the user "to" by the user "from"              |
| GET         | /api/group/:id       |                             |                |              |                                                              |
| POST        | /api/group/:id       | {name}(OPTIONAL)            |                |              | create a new group with name "name"                          |
| DELETE      | /api/group/:id       | (empty)                     |                |              | delete the group                                             |
| POST        | /api/group/add/:id   | {memberID}                  |                |              | add a user with ID "memberID" to the group                   |
| POST        | api/group/remove/:id | {memberID}                  |                |              | remove the user with ID "memberID" from the group            |
| POST        | api/group/leave/:id  | {myID}                      |                |              | leave the group                                              |

## Links

### Trello/Kanban

[Link to your trello board](https://trello.com/b/nY1pWVpp/final-project) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/0Yasser/Final-Project)

[Server repository Link](https://github.com/screeeen/project-server)

[Deployed App Link](http://heroku.com/)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com/)

Wireframe

The url to your presentation slides

[Figma Link](http://www.figma.com)

https://www.figma.com/