const xlsx = require('node-xlsx').default; 
const fs = require('fs'); // for file
const path = require('path')
module.exports = (on, config) => {
    on('task', { parseXlsx({ filePath }) 
        { 
            return new Promise((resolve, reject) =>
                { try 
                    {
                        const jsonData = xlsx.parse(fs.readFileSync(filePath)); 
                        resolve(jsonData);
                    } catch (e) {
                        reject(e);
                    } 
                }
            );
        }
    }); 
}
const readXlsx = require('./read-xlsx')

module.exports = (on, config) => {
    on('task', {
        'readXlsx': readXlsx.read
    })
}