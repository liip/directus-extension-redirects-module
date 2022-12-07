import { defineEndpoint } from '@directus/extensions-sdk';
import { RedirectItem } from './types';

export default defineEndpoint((router, { services }) => {
	const { ItemsService } = services;

	const useRegex = async (redirectsService, path: string, page: number): Promise<RedirectItem[] | undefined> => {
		const redirectsWithRegex: RedirectItem[] = await redirectsService.readByQuery({
			fields: ['*'],
			filter: { regex: { _eq: true }},
			page: page,
		});

		if (redirectsWithRegex.length) {
			const match: RedirectItem[] =
				redirectsWithRegex.filter((redirectItem) => {
					const regex: RegExp = new RegExp(redirectItem.from);
					return regex.test(path);
				});

			return match.length ? match : useRegex(redirectsService, path, page+1);
		}
	}

	router.get('/find', async (req, res) => {

		const redirectsService = new ItemsService(
			'redirects',
			{
				schema: req.schema,
				accountability: req.accountability
			}
		);

		const match = await redirectsService.readByQuery({
			fields: ['*'],
			filter: {
				regex: { _eq: false },
				from: { _eq: req.query.path },
			},
		});

		if (match.length) {
			res.send(match[0]?.to);
		} else {
			const matches: RedirectItem[] | undefined = await useRegex(redirectsService, req.query.path, 0);
			matches ? res.send(matches[0]?.to) : res.send(undefined);
		}
	});
});
