import { JsonPipe } from '@angular/common';
import { Addressable} from './addressable';

export interface DeviceSrv{
        created: string
        modified: string
        origin: string
        description: string
        id: string
        name: string
        lastConnected: string
        lastReported: string
        operatingState: string
        labels:string[]
        addressable: Addressable
        adminState: string
}