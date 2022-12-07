import { defineEndpoint } from '@directus/extensions-sdk';
import { RedirectItem } from './types';

export default defineEndpoint((router, { services }) => {
	const {ItemsService} = services;

	router.get('/find', async (req, res) => {

		const redirectsService = new ItemsService(
			'redirects',
			{schema: req.schema, accountability: req.accountability}
		);

		const match = await redirectsService.readByQuery({
			fields: ['*'],
			filter: {
				regex: {_eq: false},
				from: {_eq: req.query.path},
			},
		});

		if (match.length) {
			res.send(match[0]?.to);
		} else {
			const redirectsWithRegex: RedirectItem[] = await redirectsService.readByQuery({
				fields: ['*'],
				filter: {regex: {_eq: true}}
			});

			const response: RedirectItem[] =
				redirectsWithRegex.filter((redirectItem) => {
					const regex: RegExp = new RegExp(redirectItem.from);
					return redirectItem.regex ? regex.test(req.query.path) : redirectItem.from === req.query.path;
				});

			res.send(response[0]?.to);
		}
	});
});
