# PostExpressServer
A <b>PostExpressServer</b> (most commonly referred to as just <b>Server</b>) is a class in the post-express library which is responsible for methods, data, and the persistence of a post-express server.

```typescript
import { PostExpressServer } from "post-express";
```

PostExpressServer can be accessed with the following line.

## Constructor
When instantiating a PostExpressServer, you are required to provide a `(number) port` as the first parameter. The constructor function will then configure the express component of the application.

## Properties
```typescript
private expressRouter: Express; 
// This property contains the Express.js component of the post-express server.
```
```typescript
private httpServer: Server; 
// This property contains the http.Server component of the post-express server, which is responsible for configuring things such as web sockets in Socket.io.
```
```typescript
private socketsEnabled: boolean; 
// Boolean value for whether or not Socket.io sockets are enabled or not.
```
```typescript
private socketServer?: Server; 
// This property contains the Socket.io server component of the post-express server, if socketsEnabled is true, and a server is instantiated.
```
```typescript
private globalHandler: RequestHandler; 
// This property contains a Express.RequestHandler which will be called for every request made to the server.
```
```typescript
public routes: PostExpressRoute[]; 
// All of the existent and running routes on the server.
```
```typescript
public db?: ServerDBData; 
// If a database is configured on the server, then the data related to the connection will be stored here.
```
```typescript
public readonly port: number; 
// The port that the server will run on.
```

## Methods
Here are the following methods.
### `Route() : PostExpressRoute | PostExpressRoute[] | undefined`
`Route()` is a function that creates a route on the server.

#### Parameters
```typescript
params: RouteParams[],
// Contains the schema for the route such as the path, method, handler, and misc options.
cb?: Function,
// The optional function to be called whenever all of the routes are created.
cbForEveryRouteCreated?: Function
// The optional function to be called whenever a singular route is created.
```

### `_Listen() : void`
`_Listen()` is a functon that starts up the server.

#### Parameters
```typescript
callback: Function
// The function that will be invoked for when the server goes online.
```

### `setDefaultPage() : void`
`setDefaultPage()` is a function that creates a redirect for "/" to go to a specific page.

#### Parameters
```typescript
route: string
// The page that "/" will redirect to.
```

### `groupRoutes() : RouteGroup`
`groupRoutes()` is a function that creates a new RouteGroup. Along with this, it moves the routes provided to `/{GroupName}/{RoutePath}`.

#### Parameters
```typescript
routes: PostExpressRoute[],
// An array of post-express routes that will be added to the new group.
path: string,
// The path for the group `/{path}/{route.path}`
sharedHandler?: RequestHandler
// The optional handler that will be shared across all of the routes in the group.
```

### `enableSockets() : void`
`enableSockets()` is a function that enables Socket.io functionality within the post-express server. It will also create a Socket.io server in the `socketServer` property.

### `createSocketServer() : Server`
`createSocketServer()` is an internal function that creates a new Socket.io server for the post-express sevrer to use. It is used by both `enableSockets()` and `getSocketServer()`.

### `getSocketServer() : void | Server`
`getSocketServer()` is a function that will return the Socket.io server in the post-express server if it is existent. If the Socket.io server doesn't exist, it will create one if `socketsEnabled` is set to true.

### `setGlobalHandler() : void`
`setGlobalHandler()` is a function that Sets the global handler of the server, which is a handler that will be invoked everytime a connection is made to the server.

#### Parameters
```typescript
handler: RequestHandler
// The handler that will be called.
```

### `execute() : void`
`execute()` is a function that will invoke a function provided in the server's prespective. It is useful for cases where you would like to use seperate files in your project to manage the same server.

#### Parameters
```typescript
func: (server: PostExpressServer, customParameters?: any[]) => any,
// The function that will be invoked by the server.
customParameters: any[]
// Custom parameters that will be passed to func along with the server.
```

### `use() : void`
`use()` is a function that is used as a wrapper for Express.use().

#### Parameters
```typescript
handlers: RequestHandler[]
// The handlers that will be used by the Express server component.
```

### `getSessionFromRequest() : any`
`getSessionFromRequest()` returns the matching in-memory session for the request object provided.

#### Parameters
```typescript
req: Request
// The Express.js request object.
```

### `setSession() : any`
`setSession()` is a function that sets the session for the provided `Request` object.

#### Parameters
```typescript
req: Request,
// The request object.
sessionData: any
// The session data that will be assigned to the session.
```

### `enableBeta() : PostExpressBetaServer`
`enableBeta()` is a function that returns a `PostExpressBetaServer` that allows the developer to use beta features that are in-development.