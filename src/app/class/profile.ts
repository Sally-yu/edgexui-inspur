import {DeviceResource} from './deviceResource';
import {Resource} from './resource';
import {Command} from './command';

export class Profile {
    created: string
    modified: string
    origin: string
    description: string
    id: string
    name: string
    manufacturer: string
    model: string
    labels: string[]
    objects: string
    deviceResources:DeviceResource[]
    resources:Resource[]
    commands:Command[]
}