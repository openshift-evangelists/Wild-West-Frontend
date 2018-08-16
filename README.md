# Wild West (frontend)
[![Dependency Check](http://img.shields.io/david/openshift-evangelists/Wild-West-Frontend.svg)](https://david-dm.org/openshift-evangelists/Wild-West-Frontend)

OpenShift, the Wild Wild West Way is a game created with two components:

* Node front end that uses the open source Phaser javascript game engine.
* [SpringBoot backend](https://github.com/openshift-evangelists/Wild-West-Backend) that uses the Red Hat OpenShift java api to communicate with Kubernetes and OpenShift.

**Goal** The goal of this simple game is illustrate what platforms objects are safe to delete that the system will automatically recover from.  Side goals of this game is to teach people how to use Phaser for game development as well as to teach people what can be achieved with automation on the Kubernetes and OpenShift platforms.

For those not familar with OpenShift, it is an enterprise distribution of Kubernetes and is an open source project by the folks at Red Hat.

**How to play**

This game queries the backend service (SpringBoot) every couple of seconds to get a list of all the Platform objects you have in your project.  It then selects one at random and displays in on the screen.  The goal of the game is to shoot the objects that can be safetly destroyed that the platform can recover from.  Be careful though, if you shoot / destroy an object that can't be automatically recreated (route for example), your game will be over.

All of this is happening in real on the server (if configured).  If you shoot a pod, the pod will actually be killed on your cluster.

**Current OpenShift Objects Supported**

* Pods
* Builds
* Deployment Configs
* Build Configs
* Persistent Volumes
* Services
* Routes

*Others* A pull request away :)

**Current Vanilla Kubernetes Objects Supported**

*coming soon*

### Development

Setup:

```bash
npm install
```

Run (with inline BACKEND_SERVICE configuration):

```bash
BACKEND_SERVICE=my-backend-host-url.com npm start
```

Configuration of Backend Service host url via Env Var:

```bash
export BACKEND_SERVICE="my-backend-host-url.com"
```

On your OpenShift cluster, for the backend to have access to the API, you need to give permission to the service account:

```
$ oc policy add-role-to-user view system:serviceaccount:wildwest:default where wildwest
```

If you want to enable destructive mode, where the player can actually delete things:

```
$ oc policy add-role-to-user edit system:serviceaccount:wildwest:default
```
