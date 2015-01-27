# X-Todo
Sample to-do web app for Xamarin interview process

## Overview
X-Todo is comprised of two semi-independent applications: a REST API built with ASP.NET MVC, and a frontend single-page application built with Ember. This makes for good separation of concerns because each app can be managed, implemented, updated, and deployed potentially without impact on the other.

## Building & Running
Installing, building, and running the app is automated and doesn’t require opening Visual Studio. You do need a couple things already in place, though:

- Windows (I used 10 under VMWare)
- IIS Express at `C:\Program Files\IIS Express\iisexpress.exe`
- A LocalDb instance named `v11.0` (`SqlLocalDB info` to check, `SqlLocalDB c v11.0` to create)
- Node.js or equivalent (I used Node v0.10.35) (Some dependencies have issues with beta versions)
- Grunt CLI (`npm install -g grunt-cli`)

If you have all those, just do

```
cd x-todo
npm install
npm run-script build
npm start
```

and open a browser to [http://localhost:4200](http://localhost:4200).

Individual tasks can be run with Grunt and Ember CLI if needed:

```
grunt install    # Installs Nuget packages
grunt msbuild    # Builds Web API project
grunt iisexpress # Serves the API at http://localhost:50993/api
ember server     # Builds and serves the frontend at http://localhost:4200
```

## Features
X-Todo is simple, but a lot of detail went into the little things, so I’d like to point a few of them out.

<dl>
<dt>Seamless Editing</dt>
<dd>Tasks and category names can be edited in-line. Simply click the text to begin editing.</dd>
<dt>Automatic Saving</dt>
<dd>Changes are saved automatically, typically after a one-second debounce period. No need to submit any forms or click any buttons.</dd>
<dt>Drag & Drop Reordering</dt>
<dd>Tasks can be rearranged by dragging and dropping (handy for making visual priority cues). Tasks can also be dragged into a different category.</dd>
<dt>Customizable Colors</dt>
<dd>Categories can be assigned a color, because it’s good for <a href="http://en.wikipedia.org/wiki/Principles_of_grouping">pattern recognition</a> and it’s fun.
<dt>Custom Date/Time UX</dt>
<dd>Designing the UX and building the UI for due dates comprised upwards of 15% of the total time I spent on the project. Personally, the only time I’m ever not annoyed while entering a time of day into a computer is when I’m doing so in OS X’s Calendar app. So, I aimed to recreate that experience for web, and I believe I did pretty well. Like everything else, due dates can be edited in-line, but when you’re not editing, they change to a more readable format, e.g. “Tomorrow at 3:00 PM” or “2 days overdue.” (N.B. I did not design the day picker itself.)</dd>
</dl>

## Limitations and Assumptions
X-Todo was built relatively quickly, so I made decisions on what I wanted to demonstrate and what I should leave out for the sake of time. Some things necessary in a production environment simply don’t exist in X-Todo. Hopefully, most of these aren’t oversights so much as assumptions I made about what was important to demonstrate. For instance, X-Todo doesn’t associate data with the user of the application. In a production situation, I might have added OAuth 2.0 authentication and let users log in with a Google account to view their own individual to-do lists. I can provide examples of my implementations of various types of user authentication in previous projects, so I chose to leave it out of this project and spend more time on other things.
