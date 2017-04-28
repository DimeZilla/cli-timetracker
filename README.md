#TLH - A time log helper for your workflow!
*A very simple time log utility for tracking hours spent on work.

*Here's the general workflow:
1. Create a project
tlh create project <project name>
2. Create a task
tlh create task <task name>
3. Assign task to project 
tlh assign <task name> to <project name>
4. Open a project
tlh open project <project name> task <task name>
5. Start timer
tlh start
6. Stop timer
tlh stop
7. Analyze time - This will print to the console all of the timers that you had running today.
tlh analyze 

## Tasks vs Projects
Tasks and projects are independent concepts in tlh. You can start a task, you can start a project, you can assign a task to a project, you can start a project with a task that is assigned but you cannot start a project with a task that is not assigned. You cannot start a project or a task that has not beeen created.
 
##Creating projects and tasks
When you create a project or a task you run >tlh create <project|task> [task or project name]. You can also pass a description that you can use to define the project. Here's an example:

*tlh create task dev --description "Down n dirty programming"

You can also put a flag to let you know whether or not the task is billable. This option is unique to tasks.

*tlh create task dev --description "Down n dirty programming" --billable

Note that both description and billable are preceeded by hyphens (--). These hyphens tell tlh that they are unordered variable. --billable is a boolean and will alway enter true if present. Any single input after the --description variable will be inputed as the value for description. This means anyting enclosed with quotes or any single unbroken by whitespace word.

Here's an example creating a project:
tlh create project Website --description "Building a website for a client"

##Listing projects and tasks
You can see what projects or tasks you have available by listing them:

*tlh list tasks
*tlh list projects
