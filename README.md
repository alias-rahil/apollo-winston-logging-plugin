### Usage:
```js
import apolloWinstonLoggingPlugin from 'apollo-winston-logging-plugin';
import { ApolloServer } from 'apollo-server';
import { createLogger } from 'winston';
const logger = createLogger();
new ApolloServer({
    plugins: [apolloWinstonLoggingPlugin(logger)],
});
```
