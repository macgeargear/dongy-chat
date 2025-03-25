# dongy-chat

### Task

**User**
- **GET /api/users**: Retrieve a list of all users.
- **GET /api/users/:id**: Retrieve a specific user by ID.
- **POST /api/users**: Create a new user.
- **PUT /api/users/:id**: Update a user's information.
- **DELETE /api/users/:id**: Delete a user.

 **Channel**
- **GET /api/channel**: Retrieve a list of all channels.
- **GET /api/channel/:id**: Retrieve a specific channel by ID.
- **POST /api/channel**: Create a new channel.
- **PUT /api/channel/:id**: Update a channel's information.
- **DELETE /api/channel/:id**: Delete a channel.

**Channel-Member**
- **GET /api/channel-member/?userId=&channelId=** Retrieve channel by user_id or user by channel_id
- **PUT /api/channel-member/**: Update a channel-member's information.
- **POST /api/channel-member/**: Add a user to a channel.
- **DELETE /api/channel-member/:user_id?channelid**: Remove a user from a channel.

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
- Latest Read
