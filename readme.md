# App generator
This cli app Scaffolds code structures and generates the required files for a predefined app niche.

## Instalation
Run `npm install mktmp` in the terminal to install the package

## How it works
To use this app on the command line type mktmp. It will prompt for missing options.
Acceptable options and their aliases are `--git`, `--dep`, `--yes` and `-g`, `-d`, `-y`.
Their definitions are as follows:
* ####`--git`: Initialize a git repository
* ####`---dep`: Comfirms the installation of dependencies found in the generated `package.json` file
* ###`--yes`: If this option is present, it skips all the prompt and generates the app using the default options
To add a template, type the template name without any hyphens like so `mktmp -y react-app.
####NB: Currently supported templates are express and react apps with their mktmp template names as `express-app` and `react-app`.

## Contributing to the project
At the moment this package only supports 2 app niches (exxpress-app and react-app) and can be found in the file config object above.
Adding support for various templates is very straight forward;
* Update the `constants.js` file adding the new template name as a property. The `constants.js` file can be found at `./src/utils/constants.js`
* Append a new object to `templates` object in the file config object. The appended object should represent the new template root directory. See example below
```javascript
  {
    "name": constants[new_template_name],
    "dirs": [],
    "files": []
  }
 ```
 NB: The `name` prop is gotten from the constants object.
 If there be any need, a new folder should be created in the template files folder at `./src/templateFiles/`. The contents of the folder should only be unique files relating to the new template (package.json, .env files), files not under this category should be represented by the file name in the `files` array of the new template object.
 
To generate files required it uses a file config object with set of rules to follow ->
* The root directory object(signifying a folder) has `name` `dirs` and `files` properties
* The `name` prop is the name of the folder
* The `files` prop is an array containing a list of files represented by their filename and extention
* The `dirs` array is a repetition of the root directory with its object and properties as well

```javascript
  const config = {
    "templates": [
      {
        "name": 'express-app',
        "dirs": [
          {
            "name": "src",
            "dirs": [
              {"name": "configs"}
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

```
