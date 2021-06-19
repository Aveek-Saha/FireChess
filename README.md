# Fire Chess
 
Play chess online with a friend, powered by Firebase. 

### Play [here](http://firechess0.web.app)
 
# How to play
 
1. Go to http://firechess0.web.app/
1. Log in with one of the auth providers.
1. Start playing:
    * Create a room and then share the room Id with a friend.
    * Get a room Id from a friend and join a room.
 
Yes, it's really that simple! 
 
For now each player can only create up to 5 rooms, though this is a number that can change based on demand. However there is no limit on how many rooms you can join at a time!
 
# Features
 
* Use Google, Twitter, GitHub or Facebook to log in
* Create a new game, or join existing ones
* Reset the board for a rematch once the game is over
* Delete rooms you created, or leave rooms you've joined
* Possible moves are highlighted on the board
* Put a game on hold and resume it whenever you like
 
# Why FireChess?
This is a follow up to my [Online-Chess](https://github.com/Aveek-Saha/Online-Chess) project where I created a chess website using sockets and hosted it on Heroku.
 
At the time I had created the project as a showcase for websockets first and as an actual place to play chess second. However this project has had far more users on the website playing chess than I anticipated and I kept running out of resources for the free Heroku tier. This meant that I got a lot of complaints that the website was inaccessible.
 
FireChess was meant as an answer to this problem. This project stores the game state in a database rather than using web sockets to communicate. This means I'm no longer dependent on a server and I can move to serverless. Moving to firebase allows me to make the website available to far more people without exceeding usage limits.

# Privacy
### Why do I need to login?
Signing in helps keep all your rooms saved so you can resume playing at any time.

### What data is stored on the database?
The only personal information stored in the database is your display name from whatever auth provider you pick.