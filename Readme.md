# Weather Service
A NodeJS solution to view weather data on any location via browser or through the REST API

## Notes
### Planning Phase
The goal of this project was to come up with some way to proxy weather data from a real source, extract only the data I think would be needed, and send that back. On top of that I wanted some way to include a front-end portion.
I debated between what to use. I have experience in NodeJS w/ the Express framework. Some NodeJS projects like [a discord bot](https://github.com/duecknoah/basic_bot) and [a twitch bot](https://github.com/duecknoah/tmi_bots). However more recently I've been learning Flask and working on a project to scrape and chart [reddit analytics](https://github.com/wilshum/Reddit-Analytics). Flask is good for getting started quickly, and NodeJS has a lot of support and is something I'd like to get even more familiar with. I also feel more comfortable in Node, so I decided to go with that as my backend.

With that in mind I wanted to chart out a little more of how the front-end would look. I wanted the user to be able to:
- register an account
- login/logout
- add or remove weather entries of different cities and have that info stored on their account for anytime they login

![layout of ui](images/planning1.jpg)
*Project diagram and intial front-end plan (bottom-left)*
![layout of ui](images/planning2.jpg)
*Main page for viewing weather data and adding new cities*
![layout of ui](images/planning3.jpg)
*Login/Register account page*

On top of this I wanted to deploy this all on a platform to host. I decided to use a well-known PAAS called Heroku to host. Which will allow me to do this for free as well and host my NodeJS instance. Since I'll want to store user data which is perfect since they also provide a DB to use.

## Setup Phase
Modules used and reasoning:
- [**Express**](https://www.npmjs.com/package/express) - I could have used the basic http module and used http.createServer(...) to handle incoming requests. However Express provides an elegant and easy way - to create endpoints, plus I'm already familiar with it.
- [**node-fetch**](https://www.npmjs.com/package/node-fetch) - Very similiar to window.fetch in Javascript in the browser, this allows me to get a Promise of a request. Needed for proxying between the user and [open weather map](https://openweathermap.org/).
- **fs** - for config file loading. The config file stores things like the API key (which shouldn't be in code for security reasons), and other info like the listening port of the Node instance.

I created an account for getting weather data and found [current](https://openweathermap.org/current) and [hourly](https://openweathermap.org/forecast5) API endpoints to use. I also created a Heroku account to deploy later on.

### Date
**The date you're submitting this.**

### Location of deployed application
**If applicable, please provide the url where we can find and interact with your running application.**


### Time spent
How much time did you spend on the assignment? Normally, this is expressed in hours.

- Planning - 2 hours
- Setup - 1 hour
- Implementing hourly and current api endpoints with documentation - 2 hours
- Filling out Readme - 1 hour

*Total 5 hours*

### Assumptions made
**Use this section to tell us about any assumptions that you made when creating your solution.**


### Shortcuts/Compromises made
**If applicable. Did you do something that you feel could have been done better in a real-world application? Please let us know.**


### Stretch goals attempted
**If applicable, use this area to tell us what stretch goals you attempted. What went well? What do you wish you
could have done better? If you didn't attempt any of the stretch goals, feel free to let us know why.**

1. **Build a simple UI for the service**
2. **Add authentication to the service**
3. **Deploy your API**
4. **Proxy a real weather API via your service to fetch the actual weather.**
     - I used [open weather map](https://openweathermap.org/) to fetch [current](https://openweathermap.org/current) and [hourly](https://openweathermap.org/forecast5) weather data for different cities. This worked surpringsly easily along with the node-fetch module. The membership is free and allows for what I needed in this project.



### Instructions to run assignment locally
**If applicable, please provide us with the necessary instructions to run your solution.**


### What did you not include in your solution that you want us to know about?
**Were you short on time and not able to include something that you want us to know
about? Please list it here so that we know that you considered it.**

A [reference to helpful videos](https://www.youtube.com/playlist?list=PLK1RhMgTzsChttnZgT0ck_fbK3_iW9nBg) that assisted me

### Other information about your submission that you feel it's important that we know if applicable.
Some ideas that didn't quite make the cut (either to complexity, no access to an API, or lack of expandibility):
- Get weather of planets in the solar system. Have a space themed UI
  - no real world API to query live planet weather data. This would miss one of the stretch goals
- Get the time and weather of Minecraft servers
  - biome and position dependent, would need a live server not to crash. Would make sense if had access to multiple servers. Can't see a real use case here for me

### Your feedback on this technical challenge
**Have feedback for how we could make this assignment better? Please let us know.**