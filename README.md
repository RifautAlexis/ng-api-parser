# NG-API-Server
Analyzes one or more typescript files and then converts them into an object.
The result is written in a JSON file for easy use.

# Installation
```bash
npm i ng-api-parser
```

# Usage
```bash
ng-api-parser generate --path src/**/*
```

## Options

### Path - `--path`
Use `--path` to set a base directory from which to analyze typescript files. This option is **mandatory** and should only point a directory or a file. It use Glob.
```bash
ng-api-parser generate [-P | --path] <path>
```
Example :
```bash
ng-api-parser generate --path src/**/*
```

### Output - `--output`
If specified, a folder or a file with the given name will be created and will contains results from the command.
If not specified it will create a file named `output.json` which will contains results fromt the command.
> To specify a output file, it must end by `.json`
```bash
ng-api-parser generate [-P | --path] <path> [-O | --output] <path>
```
Example :
```bash
ng-api-parser generate --path src/**/* --output ./output-folder
ng-api-parser generate --path src/**/* --output ./file-folder.json
```

### Exclude - `--exclude`
If specified, `--exclude` allows to ignore a set of files from the files which are analyzed.
```bash
ng-api-parser generate [-p | --path] <path> [-E | --exclude] <path>
```
Example :
```bash
ng-api-parser generate --path src/**/* --exclude node_modules/**/*
```

### Parent Related - `--parentRelated`
If specified `--parentRelated` output the result in a folder with the same name as the file's parent which as been analyzed.
> It can't be used when the `--output` specify a file name
```bash
ng-api-parser generate [-p | --path] <path> [-PR | --parentRelated]
```
Example :
```bash
ng-api-parser generate --path src/**/* --parentRelated
```