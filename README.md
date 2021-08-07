# comp30022-it-project

# yarn usage (all commands are run at project root)

I couldn't get our test pipeline to run properly with the react app as a subfolder of our node server, as react is very pedantic about which version of jest it uses and didnt like
sharing with node.

To solve this, I split the two into two client/server directories. This created the problem of heroku not properly installing dependencies when the app was being deployed

Thus the solution I landed on was yarn workspaces.

The structure looks like this
```
(root)
- package.json
- yarn lock
- client
-- package.json
- server
-- package.json
```
and in the (root) package.json we see:
```
  "workspaces": {
    "packages": [
      "client",
      "server"
    ]
  }
```
what this means is that the (root) yarn controlls the whole "monorepo" and is the controller for all dependencies, we never directly install dependencies here.
So do not run "yarn add somepackage"

we need to install our packages to a specific workspace, so they get managed and installed correctly during production. to do so run:

```
yarn workspace client add somepackage
```
```
yarn workspace server add somepackage
```

additionally, there is no distinguishment between dependencies and devDependencies (packages you only need in development like prettier) for the react app because it
all gets built into minified files when deployed. There is however a distinguishment between dependencies and devDependencies for the node server so please be careful
which you install as we go through the sem

to install something as a devDependency run:
```
yarn workspace server add -D someDevpackage
```
# Test Pipeline

The way the test pipeline works, is by running:
```
yarn workspace server/client build
yarn workspace server/client test
```
for both the client and the server, and you can check the commands being run in the ./github/node.js.yml file

# Deployment

The way deployment works is by pushing the repo to heroku whenever we make a merge or a push to main, what heroku then does is:
```
yarn workspaces foreach run build
yarn workspace server run start
```
^ then the server serves the static files that were build from react so we dont need to start the react app

# Other commands

you can start either the backend or the frontend individually by running:
```
yarn workspace client/server dev
```
or you can start them both at once by running:
```
yarn dev
```
you can look at all the available commands by checking the scripts section of each package.json