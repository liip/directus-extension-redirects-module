import { defineEndpoint } from '@directus/extensions-sdk';
import { RedirectItem } from './types';

export default defineEndpoint((router, { services }) => {
	const { ItemsService } = services;

	router.get('/find', async (req, res) => {

		const redirectsService = new ItemsService(
			'redirects',
			{ schema: req.schema, accountability: req.accountability }
		);

		const redirects: RedirectItem[] =
			await redirectsService.readByQuery({ fields: ['*'] });

		const response: RedirectItem[] =
			redirects.filter((redirectItem) => {
				const regex: RegExp = new RegExp(redirectItem.from);
        return redirectItem.regex ? regex.test(req.query.path) : redirectItem.from === req.query.path;
      });

		res.send(response[0]?.to);
	});
});
