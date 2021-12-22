# ChatUp	



# Quick Compo

<img src="/Users/enriquecoscarelli/Downloads/minilogo.png" alt="minilogo" style="zoom:75%;" />

## Description

***ChatUp*** it's a Chatting app.

## User Stories

- **Signup:** As a user I can sign up.
- **Login:** As a user I can login.
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

- ////

  



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
  - user.create_user()
  - user.log_user()
- User Service
  - user.get_user_from_token()
  - user.get_username()
  - user.delete_account()
- Friends Service
  - friends.sendRequest()
  - friends.replayToRequest()
  - friends.removeFriend()
- Group Service
  - group.getGroup()
  - group.createGroup()
  - group.deleteGroup()
  - group.viewMyGroups()
  - group.addToGroup()
  - group.removeFromGroup()
  - group.leaveGroup()

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



Group model

```
{
    name: {
        type:String
    },
    creator: {
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }
    ,
    members: [{
        type:Schema.Types.ObjectId, 
        ref: 'users'
    }]
}
```





## Backend routes

| HTTP Method | URL                     | Request Body                        | Success status | Error Status | Description                                                  |
| ----------- | ----------------------- | ----------------------------------- | -------------- | ------------ | ------------------------------------------------------------ |
| POST        | `/auth/signup`          | {username, email, password}         | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`           | {username, email, password}         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| GET         | `/api/user/:id`         |                                     |                |              | Checks if the sent token (id) is valid and then send the user details. |
| GET         | `/api/user/search/:id`  |                                     |                |              | Checks if the sent username (id) exists and then send the user details. |
| DELETE      | `/api/user/:id`         |                                     |                |              | Used to delete the user's account.                           |
| POST        | `/api/friend`           | {myUsername, theirUsername}         |                |              | Used to send a friend request where "myUsername" is the sender's username and "theirUsername" is the receiver's username |
| PUT         | `/api/friend`           | {replay, myUsername, theirUsername} |                |              | Used to replay by "accept" or "reject" to a friend request that is sent to myUsername from a theirUsername |
| DELETE      | `/api/friend`           | {myID, friendID}                    |                |              | Used to delete the user friendID by the user friendID        |
| GET         | `/api/group/:id`        |                                     |                |              | send a group details                                         |
| POST        | `/api/group/:id`        | {name}                              |                |              | create a new group with name "name" created by user ID (id)  |
| PUT         | `/api/group/:id`        | (myID)                              |                |              | delete the group with ID (id)                                |
| GET         | `/api/group/byuser/:id` |                                     |                |              | send the groups that im in                                   |
| POST        | `/api/group/add/:id`    | {memberUsername}                    |                |              | add the user "memberUsername" to the group (id)              |
| POST        | `api/group/remove/:id`  | {myID,memberUsername}               |                |              | remove the user "memberUsername" from the group (id)         |
| POST        | `api/group/leave/:id`   | {myID}                              |                |              | leave the group (id)                                         |

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