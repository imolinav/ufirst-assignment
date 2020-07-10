# UfirstAssignment

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.22.

## Development server

Run `npm start` to start the app. The command will first install the node dependencies necessary, then parse the txt file into a json one and then serve the app.

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Parsing the data

Executing `node data-import.js` will execute the import data js file.

This file gets the contents of the `data-import/epa-http.txt` file, separate it's contents by line break, then iterate each line creating a json item which will be stored in an array which in the end would get included into `data-import/data.json`

## Executing the app

Executing `ng serve` with `data.json` already created, or `npm start` if not will serve the application.

It will include both `data.json` and `canvasjs.min.js` and, iterating `data.json`, will mount and render the different charts.