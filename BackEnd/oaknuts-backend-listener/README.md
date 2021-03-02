### README

This is the oaknuts backend listener for the Matic dagger network

### How to use

The listener uses yarn as the package manager

```
cd oaknuts-backend-listener
yarn install
```

go to the source directory and run index.js

```
cd src
node index.js
```

### Listener will listen for new events for addresses

ex:

`confirmed:addr/{address}/tx/in` Will listen for all incoming transactions for that address

`confirmed:addr/{address}/tx/out` Will listen for all outgoing transactions for that address

`confirmed:addr/{address}/tx` Will listen for all in/out transactions for that address

### How to Deploy

```
make deploy
```

### How to Build

```
make docker
```

### How to Start in Docker

```
make docker && make start
```
