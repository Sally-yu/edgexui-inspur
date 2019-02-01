import {Propertie} from './propertie';
import {Attribute} from './attribute';

export class DeviceResource{
    description: string
    name: string
    tag: string
    properties:Propertie
    attributes: Attribute
}