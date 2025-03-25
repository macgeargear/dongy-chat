# dongy-chat

### Task

**User**
- **GET /api/users**: Retrieve a list of all users.
- **GET /api/users/:id**: Retrieve a specific user by ID.
- **POST /api/users**: Create a new user.
- **PUT /api/users/:id**: Update a user's information.
- **DELETE /api/users/:id**: Delete a user.

**Channel**
- **GET /api/channels**: Retrieve a list of all channels.
- **GET /api/channels/:id**: Retrieve a specific channel by ID.
- **POST /api/channels**: Create a new channel.
- **PUT /api/channels/:id**: Update a channel's information.
- **DELETE /api/channels/:id**: Delete a channel.
- **POST /api/channels/user/:user_id**: Add a user to a channel.
- **DELETE /api/channels/uesr/:user_id**: Remove a user from a channel.

**Message**
- **GET /api/messages**: Retrieve a list of all messages.
- **GET /api/messages/:id**: Retrieve a specific message by ID.
- **POST /api/messages**: Create a new message.
- **DELETE /api/messages/:id**: Delete a message.

**Special**
- Theme
- ~~Auth~~
- ~~Typing~~
- Delete message
