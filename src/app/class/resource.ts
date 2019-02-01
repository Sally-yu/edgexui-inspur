import {ResourceGet} from './resourceGet';
import {ResourceSet} from  './resourceSet';

export class Resource{
    name:string
    get:ResourceGet[]
    set:ResourceSet[]
}