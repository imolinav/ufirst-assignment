/**
 * 
 * Data loading script
 * -------------------
 * Description: opens the file "epa-http.txt" and splits it on line breaks. 
 * Then for each item it gets the different properties and reformats them into a new json element, which then pushes into an array.
 * 
 */

var fs = require('fs');
var http_methods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'PATCH', 'OPTIONS'];

fs.readFile('data-import/epa-http.txt', 'utf8', function (err, data) {
    if (err) throw err;
    var obj = [];
    data =  data.split('\n');

    for(let [index, value] of data.entries()) {
        if(value == '') {
            continue;
        }     
        let item_data = value.split(' ');
        let datetime = value.match(/\[(.*?)\]/)[1].split(':');
        let request = value.match(/\"(.*?)\"/)[1];

        let method = http_methods.includes(request.split(' ')[0]) ? request.split(' ')[0] : undefined;
        let protocol = request.includes('HTTP/') ? request.split(' ')[request.split(' ').length - 1].split('/') : [undefined, undefined];

        let url = '';
        if(request.includes('HTTP/') && method) {
            url = request.match(/\ (?:.*)*\ |HTTP/)[0];
        } else if(request.includes('HTTP/') && !method) {
            url = request.match(/(?:.*)* /)[0];
        } else if(!request.includes('HTTP/') && method) {
            url = request.match(/\ (?:.*)*/)[0];
        } else {
            url = request;
        }

        let new_data = {
            "host": item_data[0],
            "datetime": {
                "day": datetime[0],
                "hour": datetime[1],
                "minute": datetime[2],
                "second": datetime[3]
            },
            "request": {
                "method": method,
                "url": url.trim(),
                "protocol": protocol[0],
                "protocol_version": protocol[1]
            },
            "response_code": item_data[item_data.length - 2],
            "document_size": item_data[item_data.length - 1]
        }
        
        obj.push(new_data);

        //Updating the progress bar
        let completed = (index / data.length) * 100;
        let bar = '='.repeat(Math.floor(completed/5));
        let empty = " ".repeat(20-Math.floor(completed/5));
        process.stdout.write(`\rImporting data [${bar}${empty}] ${Math.floor(completed)}%`);
    }
    fs.writeFile('data-import/data.json', JSON.stringify(obj), 'utf8', function(err) {
        if(err) throw err;
    });
    process.stdout.write(`\rImporting data [====================] 100%\n\nData succesfully imported!\n\n`);
});