import { Addressable} from './addressable';
import {DeviceSrv} from './deviceSrv';
import {Profile} from './profile';

export class Device{
    
        created: string
        modified: string
        origin: string
        description: string
        id: string
        name: string
        adminState: string
        operatingState: string
        addressable: Addressable
        lastConnected: string
        lastReported: string
        labels: string[]
        location: string
        service: DeviceSrv
        profile:Profile


}