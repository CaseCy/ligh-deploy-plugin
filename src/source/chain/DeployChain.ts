import { Context } from './Context';
import { Excutor } from '../types';
export class DeployChain {
    private excutors: Array<Excutor> = new Array();
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    addExcutor(excutor: Excutor): void {
        this.excutors.push(excutor);
    }

    run() {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            try {
                for (let excutor of this.excutors) {
                    await excutor.handle(this.context);
                    count++;
                }
            } catch (e) {
                reject(e);
            }
            resolve(count);
        })
    }
}