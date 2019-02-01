import {CommandGet} from './commandGet';
import {CommandPut} from './commandPut';

export class Command {
    created: string
    modified: string
    origin: string
    id: string
    name: string
    get: CommandGet
    put: CommandPut
}