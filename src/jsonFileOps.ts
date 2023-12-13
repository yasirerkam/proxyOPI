import fs from 'node:fs';
import path from 'path';

export default class JsonFileOps {

    static isFileExists(path: string): boolean {
        try {
            fs.accessSync(path, fs.constants.F_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    static readJson(pathObj: string) {
        let obj: any;
        const pathParsed = path.parse(pathObj);

        try {
            console.log("\n'%s' is reading...", pathParsed.base);
            const dictData = fs.readFileSync(pathObj, 'utf-8');
            obj = JSON.parse(dictData);
            console.log("'%s' has been read.", pathParsed.base);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log("'%s' is not found. Create it first!", pathParsed.base);
                return undefined;
            }

            console.log("An error occurred while reading '%s':\n", pathParsed.base, error);
            return undefined;
        }

        return obj;
    }

    static writeJson(obj: any, pathObj: string, options: any, format = false) {
        const pathParsed = path.parse(pathObj);

        try {
            console.log("\n'%s' is writing...", pathParsed.base);
            let dictData;
            if (format)
                dictData = JSON.stringify(obj, null, 4);
            else
                dictData = JSON.stringify(obj);
            fs.writeFileSync(pathObj, dictData, options);
            console.log("Writing to file is complete '%s'", pathParsed.base);
        } catch (error) {
            console.log("An error occurred while writing '%s':\n", pathParsed.base, error);
            return;
        }
    }
}
