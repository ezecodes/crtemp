# App generator
This package Scaffolds development code structures and generates the required files for a predefined app niche.

## Instalation

## How it works
To generate files required it uses a file config object with set of rules to follow ->
* The root directory object(signifying a folder) has `name` `dirs` and `files` properties
* The `name` prop is the name of the folder
* The `files` prop is an array containing a list of files represented by their filename and extention
* The dirs(an array) is a repetition of the root directory with its object and properties as well

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
