import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'redirectionURL',
	name: 'Redirection-URL',
	icon: 'box',
	description: 'This is my custom interface!',
	component: InterfaceComponent,
	group: 'standard',
	types: ['string'],
	options: [
		{
			field: 'allowExternalLinks',
			name: 'Allow external Links',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: false,
			},
		},
	],
});
