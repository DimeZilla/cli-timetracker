# TLH - A time log helper for your workflow!
A very simple time log utility for tracking hours spent on work.

Here's the general workflow:
1. Create a project
```
tlh create project <project name>
```
2. Create a task
```
tlh create task <task name>
```
3. Assign task to project 
```
tlh assign <task name> to <project name>
```
4. Open a project
```
tlh open project <project name> task <task name>
```
5. Start timer
```
tlh start
```
6. Stop timer
```
tlh stop
```
7. Analyze time - This will print to the console all of the timers that you had running today.
```
tlh analyze
```

## Installation
Installation is super easy. First this is a node app so make sure that you have nodejs installed. Check out the package.json to see which node 4.x+.
1. Just clone the repository
2. If on linux run:
```
./install.sh
```
If not on linux or on a linux emulator like cygwin, run
``` 
npm install -g
```

### Hooray you are good to go!

## Tasks vs Projects
Tasks and projects are independent concepts in tlh. You can start a task, you can start a project, you can assign a task to a project, you can start a project with a task that is assigned but you cannot start a project with a task that is not assigned. You cannot start a project or a task that has not beeen created.
 
## Creating projects and tasks
When you create a project or a task you run >tlh create <project|task> [task or project name]. You can also pass a description that you can use to define the project. Here's an example:
```
tlh create task dev --description "Down n dirty programming"
```
You can also put a flag to let you know whether or not the task is billable. This option is unique to tasks.
```
tlh create task dev --description "Down n dirty programming" --billable
```
Note that both description and billable are preceeded by hyphens (--). These hyphens tell tlh that they are unordered variable. --billable is a boolean and will alway enter true if present. Any single input after the --description variable will be inputed as the value for description. This means anyting enclosed with quotes or any single unbroken by whitespace word.

Here's an example creating a project:
```
tlh create project Website --description "Building a website for a client"
```
## Listing projects and tasks
You can see what projects or tasks you have available by listing them:
```
tlh list tasks
tlh list projects
```

## Assigning a task to a project
Tasks and projects are independent of each other in tlh but in order to run a task under a project, the task must be a valid task that is assigned to the project. This allows us to keep validate our workflow and not start miscellaneous tasks for projects. Continuing with our example from above:
```
tlh assign dev to Website
```
Now when you run `tlh list projects` you'll see "dev" listed in the tasks column output for that projects

## Opening a project and/or task
Opening a project and/or task is essentially the same as starting a timer but instead of starting it is setting the arguments thats that you pass to it as the default workspace arguments. Starting a timer requires you to tell it whether you are starting a task and or project. If you pass no arguments to start then it will look to see if you've opened a project and/or a task and will use that data to start the timer.
```
tlh open project "Website" task "dev"
tlh start
```
This will start a timer for your project named "Website" and the task "dev"

## Pausing the project and or task to work quickly on something else
This is easy. If you followed from above and have an open project, then just run
```
tlh stop
tlh start project "other website" task "design"
```
NOTE: this assumes that you have already created a project called "other website," you've created a task called "design" and you've assigned design to the task "other website."
Now if you run `tlh stop` and then run `tlh start` if will stop the project "other website" and start the project from your open session "Website"

## Analyzing your timers for the day
This is the real power behind the cli. If you run `tlh analyze` you will get the full output of all the timers that you started and stopped that day. 
```
tlh analyze
```
But sometimes you don't care to pull out your calculator and crunch all the numbers to enter into that office mandated google spreadsheet. No worries. Just run
```
tlh analyze --groupby projects
```
This will list out allf the timer in hours that you spent on each project that day. You can even group by tasks:
```
tlh analyze --groupby tasks
```
Here you will see how much time you spent on dev vs how much time you spent on design or twirling your thumbs or what ever. 
The big thing that I use is 
```
tlh analyze --groupby projects --and tasks
```
TLH supports grouping by both projects and tasks so that you can see how much time within each project you spent on each task.


### Thank you ver much. I hope you enjoy this CLI. 
Email me at diamond.joshh@gmail.com if you have any questions. Any code you commit would be fantastic.
