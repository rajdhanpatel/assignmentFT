require('dotenv').config();
const fs = require('fs');
const {Parser} = require('json2csv');
const parserObj = new Parser();

const express = require('express');
const app = express();
const mysql = require('./connection').con;
const companyID = [];
const companyName = [];

app.get('/add',(req,res)=>{
    //step 1. storing comapany-name and company-id in array
    mysql.query('select CreatedByCompanyId, CreatedByCompanyName from augtrip group by CreatedByCompanyId',(error,data)=>{
        let obj = data;       
        let j = 0;
        //data is array of obj so it will take obj one by one from array-of-obj
        for(let i of data){   
            companyID.push(obj[j]['CreatedByCompanyId']);
            companyName.push(obj[j]['CreatedByCompanyName']);
            j++;
        }
    });

    //step 2. putting the companyID in query dynamically to fetch record as per company-name and store in seperate csv file
    let i = 0;
    for(let id of companyID){
        mysql.query('SELECT * FROM augtrip WHERE CreatedByCompanyId = ?',[id], function (err, d) {
            if(i!=0){//avide first row because its column name
                const csvData = parserObj.parse(d);                
                fs.writeFileSync(`${companyName[i]}_${id}.csv`,csvData);
            }            
            i++;                                    
        });
    }
});


//server
app.listen(process.env.PORT,(err)=>{
    if(err) throw err;
    else console.log(`server is running at port ${process.env.PORT}`);
});

