import { defineEndpoint } from '@directus/extensions-sdk';
import { RedirectItem } from './types';

export default defineEndpoint((router, { services }) => {
	const { ItemsService } = services;

	const findMatchingRegexRedirects = async (redirectsService, path: string, page: number): Promise<RedirectItem[] | undefined> => {
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

			return match.length ? match : findMatchingRegexRedirects(redirectsService, path, page+1);
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

		const exactMatches = await redirectsService.readByQuery({
			fields: ['*'],
			filter: {
				regex: { _eq: false },
				from: { _eq: req.query.path },
			},
		});

		if (exactMatches.length) {
			res.send(exactMatches[0]?.to);
		} else {
			const regexMatches: RedirectItem[] | undefined = await findMatchingRegexRedirects(redirectsService, req.query.path, 0);
			regexMatches ? res.send(regexMatches[0]?.to) : res.send(undefined);
		}
	});
});
