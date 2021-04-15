import { nanoid } from 'nanoid';
import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base';
import winston from 'winston';

interface Options {
	config?: {
		didEncounterErrors?: boolean;
		didResolveOperation?: boolean;
		executionDidStart?: boolean;
		parsingDidStart?: boolean;
		responseForOperation?: boolean;
		validationDidStart?: boolean;
		willSendResponse?: boolean;
		requestDidStart?: boolean;
	}

	levels?: {
		debug?: string;
		info?: string;
		error?: string;
	}
}

const stringify = (obj: unknown) => JSON.stringify(obj);

const apolloWinstonLoggingPlugin = (
	winstonInstance: winston.Logger,
	opts: Options = {},
): ApolloServerPlugin => {
	const {
		didEncounterErrors = true,
		didResolveOperation = false,
		executionDidStart = false,
		parsingDidStart = false,
		responseForOperation = false,
		validationDidStart = false,
		willSendResponse = true,
		requestDidStart = true,
	} = opts.config || {};

	const { debug = 'debug', info = 'info', error = 'error' } = opts.levels || {};

	return {
		requestDidStart(context) {
			const id = nanoid();
			const { query, operationName, variables } = context.request;
			if (requestDidStart) {
				winstonInstance.log(info, stringify({
					id,
					event: 'request',
					operationName,
					query: query?.replace(/\s+/g, ' '),
					variables,
				}));
			}
			const handlers: GraphQLRequestListener = {
				didEncounterErrors({ errors }) {
					if (didEncounterErrors) winstonInstance.log(error, stringify({ id, event: 'errors', errors }));
				},

				willSendResponse({ response }) {
					if (willSendResponse) {
						winstonInstance.log(debug, stringify({
							id,
							event: 'response',
							response: response.data,
						}));
					}
				},

				didResolveOperation(ctx) {
					if (didResolveOperation) {
						winstonInstance.log(debug, stringify({
							id, event: 'didResolveOperation', ctx,
						}));
					}
				},
				executionDidStart(ctx) {
					if (executionDidStart) winstonInstance.log(debug, stringify({ id, event: 'executionDidStart', ctx }));
				},

				parsingDidStart(ctx) {
					if (parsingDidStart) winstonInstance.log(debug, stringify({ id, event: 'parsingDidStart', ctx }));
				},

				validationDidStart(ctx) {
					if (validationDidStart) winstonInstance.log(debug, stringify({ id, event: 'validationDidStart', ctx }));
				},

				responseForOperation(ctx) {
					if (responseForOperation) {
						winstonInstance.log(debug, stringify({
							id, event: 'responseForOperation', ctx,
						}));
					}
					return null;
				},
			};
			return handlers;
		},
	};
};

export default apolloWinstonLoggingPlugin;
