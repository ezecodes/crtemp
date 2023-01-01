# App generator
This package Scaffolds development code structures and generates the required files for a predefined app niche.

## Instalation

## How it works
To generate files required it uses a file configuration object

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
