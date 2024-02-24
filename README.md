# Overview
Analyzes one or more typescript files and then converts them into an object.
The result is written in a JSON file for easy use.

# Installation
```bash
npm i ng-api-parser
```

# Usage
```bash
ng-api-parser generate --path path/to/directory
```

## Options
--path 
Required and should point a directory or file

--output
Optional and should point a file

--exclude
Optional

--parentRelated [--pr]
Optional
default value is false
explicit value to false => --no-parentRelated [--no-pr]