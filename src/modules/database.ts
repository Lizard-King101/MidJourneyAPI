const mysql = require('mysql');
console.log(global.config);

export class DataBase {
    connected = false;
    con: any;
    constructor() {
        this.con = mysql.createConnection(global.config.database);
    }

    query(sql: string){
        return new Promise((res)=>{
            this.Connect().then((err)=>{
                if(err) res({error: err});
                this.con.query(sql, (err: any, result: any)=>{
                    if(err) res({error: err});
                    res(result);
                })
            })
        })
    }
    
    select(options: any){
        return new Promise((res)=>{
            if(!options.table) res({error: 'No Table defined'});
            let sql = `SELECT ${options.columns ? options.columns.join(',') : '*'} FROM ${options.table} ${(options.where ? 'WHERE ' + [options.where].join(' ') : '')}`;
            this.Connect().then((err)=>{
                if(err) res({error: err});
                this.con.query(sql, (err: any, result: any)=>{
                    if(err) res({error: err});
                    res(result);
                })
            })
        })
    }
    
    getRow(sql: string) {
        return new Promise((res) => {
            this.query(sql).then((result: any) => {
                if(result.error) res(result);
                else res(result[0]);
            })
        })
    }
    
    update(options: any) {
        return new Promise((res) => {
            if(options.table && options.data && options.where && (Array.isArray(options.where) || typeof options.where == 'string')) {
                new Promise((next) => {
                    let set = 'SET ';
                    let keys = Object.keys(options.data);
                    keys.forEach((key, i) => {
                        let val = options.data[key];
                        if(typeof val == 'boolean') val = val ? 1 : 0;
    
                        if(i == keys.length - 1) {
                            if(val == null) {
                                set += ` ${key} = ${val}`;
                            } else {
                                set += ` ${key} = '${val}'`;
                            }
                            next(set);
                        } else {
                            if(val == null) {
                                set += ` ${key} = ${val},`;
                            } else {
                                set += ` ${key} = '${val}',`;
                            }
                        }
                    })
                }).then((set) => {
                    let where = Array.isArray(options.where) ? options.where.join(' ') : options.where;
                    let sql = `UPDATE ${options.table} ${set} WHERE ${where}`;
                    this.Connect().then((err)=>{
                        if(err) res({error: err});
                        this.con.query(sql, (err: any, result: any)=>{
                            if(err) res({error: err});
                            res(result);
                        })
                    })
                })
            } else {
                res({error: 'missing options {table: String, data: Object, where: String[] }'});
            }
        })
    }
    
    insert(table: string, data: any) {
        // added this to handle null values not being turned into empty strings
        let values = '';
        Object.values(data).forEach((value, index) => {
            if (index != Object.values(data).length - 1) {
                if (value == null) {
                    values += "" + null + ",";
                } else {
                    values += "'" + value + "',";
                }
            }
            else if (index == Object.values(data).length - 1) {
                if (value == null) {
                    values += "" + null;
                } else {
                    values += "'" + value + "'";
                }
            }
        });
        return new Promise((res) => {
            this.query(`INSERT INTO ${table} (${Object.keys(data).map(k => table + '.' + k).join(',')}) VALUES (${"" + values + ""})`).then((result: any) => {
                if(!result.error) res(result);
                else res(result);
            })
        })
    }
    
    insertMultiple(table: string, dataArray: any[]) {
        return new Promise(async (res) => {
            if(table && Array.isArray(dataArray)) {
                let firstKeys;
                let newDataArray: any[] = [];
                let insertData: any[] = [];
                let error = false;
                for(let i = 0; i < dataArray.length; i++) {
                    let data = dataArray[i];
                    let newData: any = {};
                    if(!firstKeys) {
                        let newData: any = await this.loadData(table, data);
                        firstKeys = Object.keys(newData);
                    } else {
                        for(let k = 0; k < firstKeys.length; k++) {
                            let key = firstKeys[k];
                            if(data[key]) {
                                newData[key] = data[key];
                            } else {
                                error = true;
                                break;
                            }
                        }
                    }
                    if(error) break;
                    newDataArray.push(newDataArray);
                }
    
                if(!error) {
                    // insert data
                    for(let i = 0; i < newDataArray.length; i++) {
                        insertData.push( await this.insert(table, newDataArray[i]));
                        if(insertData[i].error) {
                            break;
                        }
                    }
                    res(insertData);
    
                } else {
                    res(false);
                }
    
            } else {
                res(false);
            }
        })
    }
    
    loadData(table: string, data: any) {
        return new Promise((res) => {
            this.query(`SELECT * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='${table}'`).then((columns: any) => {
                if(data) {
                    let returnData: any = {};
                    columns.forEach((column: any, i: number) => {
                        let col_name = column.COLUMN_NAME
                        if(data[col_name]) {
                            returnData[col_name] = data[col_name];
                        } else if(column.IS_NULLABLE) {
                            returnData[col_name] = null;
                        }
    
                        if(columns.length - 1 == i) {
                            res(returnData);
                        }
                    });
                } else {
                    res(false);
                }
            })
        })
    }

    Connect(){
        return new Promise((res)=>{
            if(this.connected) res(false);
            else {
                try {
                    this.con.connect((err: any)=>{
                        if(err) {
                            res(err);
                        } else {
                            this.connected = true;
                            res(false);
                        }
                    })
                } catch (e) {
                }
            }
        })
    }
}