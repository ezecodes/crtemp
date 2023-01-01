import constants from '../utils/constants.js';

const config = {
	"templates": [
		{
			"name": constants.EXPRESS,
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
			"name": constants.REACT,
			"dirs": [],
			"files": []
		}
	]
}

export default config