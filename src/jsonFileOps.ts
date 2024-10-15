import fs from "node:fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import PathLb from "path";

export default class JsonFileOps {

    static readonly __filename = fileURLToPath(import.meta.url);
    static readonly __dirname = dirname(__filename);


    static isFileExists(pathObj: string): boolean {
        pathObj = PathLb.join(__dirname, pathObj);

        try {
            fs.accessSync(pathObj, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    static readJson(pathObj: string) {
        pathObj = PathLb.join(__dirname, pathObj);

        let obj: any;
        const pathParsed = PathLb.parse(pathObj);

        try {
            console.log(`\n'${pathParsed.base}' is reading...`,);
            const dictData = fs.readFileSync(pathObj, 'utf-8');
            obj = JSON.parse(dictData);
            console.log(`'${pathParsed.base}' has been read.`,);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.warn(`'${pathObj}' is not found. Create it first!`,);
                console.warn(`Current directory: '${process.cwd()}'`,);
                return undefined;
            }

            console.error(`An error occurred while reading '${pathParsed.base}':\n${error}`);
            return undefined;
        }

        return obj;
    }

    static writeJson(obj: any, pathObj: string, options: any, format = false) {
        pathObj = PathLb.join(__dirname, pathObj);

        const pathParsed = PathLb.parse(pathObj);

        try {
            console.log(`\n'${pathParsed.base}' is writing...`);
            let dictData;
            if (format)
                dictData = JSON.stringify(obj, null, 4);
            else
                dictData = JSON.stringify(obj);
            fs.writeFileSync(pathObj, dictData, options);
            console.log(`'${pathParsed.base}' is written.`);
        } catch (error) {
            console.error(`An error occurred while writing '${pathParsed.base}':\n${error}`);
            return;
        }
    }
}
