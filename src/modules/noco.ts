import axios from 'axios';
import FormData from 'form-data';
import { PathLike } from 'fs-extra';
import fs from 'fs-extra';

export class NocoDB {
    auth_headers: AuthHeaders;
    constructor(private config: Config) {
        this.auth_headers = {
            'xc-token': this.config.api_token
        }
    }

    uploadImage(image: PathLike, path: string): Promise<Array<UploadedImage>> {
        return new Promise(async (resolve, reject) => {
            let url = `${this.config.host}/api/v1/db/storage/upload`;
            let formData = new FormData();
            formData.append('files[]', fs.createReadStream(image), image.toString().split('/').pop());
            
            let result = await axios.post<Array<UploadedImage>>(url, formData, {
                params: {
                    path
                },
                headers: {
                    ...formData.getHeaders(),
                    ...this.auth_headers
                }
            }).catch((error) => {
                reject(error);
            });

            if(!result) return;
            else resolve(result.data);
        })
    }

    insertRow<T>(project: string, table: string, data: any): Promise<T> {
        return new Promise(async (resolve, reject) => {
            let url = `${this.config.host}/api/v1/db/data/v1/${project}/${table}`;

            let result = await axios.post<T>(url, data, {
                headers: this.auth_headers
            }).catch((error) => {
                reject(error);
            });

            if(!result) return;
            resolve(result.data);
        })
    }

    getRows<T>(project: string, table: string, options: Partial<GetRowsOptions>): Promise<GetRows<T>>
    getRows(project: string, table: string, options: Partial<GetRowsOptions>): Promise<GetRows<any>> {
        return new Promise(async (resolve, reject) => {
            let url = `${this.config.host}/api/v1/db/data/v1/${project}/${table}`;
            let opt = <Partial<GetRowsOptions>>{...GetRowsOptionsDefaults, ...options};
            let result = await axios.get(url, {
                params: opt,
                headers: this.auth_headers
            }).catch((error) => {
                reject(error);
            });

            if(!result) return;
            resolve(result.data);
        });
    }
}

const GetRowsOptionsDefaults: Partial<GetRowsOptions> = {
    limit: 25,
    shuffle: 0,
    offset: 0
}
export interface GetRowsOptions {
    where: string;
    sort: string;
    fields: string;
    limit: number;
    shuffle: number;
    offset: number;
}
export interface GetRows<T> {
    list: Array<T>;
    pageInfo: {
        totalRows: number;
        page: number;
        pageSize: number;
        isFirstPage: boolean;
        isLastPage: boolean;
    }
}


export interface Image {
    url: string;
    title: string;
    mimetype: string;
    size: number;
}

export interface AuthHeaders {
    'xc-token'?: string;
}

export interface UploadedImage {
    url: string;
    title: string;
    mimetype: string;
    size: number;
}

export interface Config {
    host: string;
    api_token: string;
}