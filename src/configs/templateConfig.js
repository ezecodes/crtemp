import {templateNames} from '../utils/constants.js';

const config = {
	"templates": [
		{
			"name": templateNames.EXPRESS,
			"dirs": [
				{
					"name": "src",
					"dirs": [
						{"name": "configs"},
						{"name": "controllers"},
						{"name": "middlewares"},
						{"name": "models"},
						{"name": "routes"},
						{"name": "services"},
						{"name": "utils"}
					],
					"files": ["app.js"]
				}, 
				{
					"name": "test",
					"dirs": []
				}
			],
			"files": [
				".env", "package.json", "index.js"
			]
		},
		{
			"name": templateNames.REACT,
			"dirs": [],
			"files": []
		}
	]
}

export default config