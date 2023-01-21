import { DataSnapshot } from "@firebase/database-types"

export default class Room {
    data: DataSnapshot
    created_at: number

    constructor (data: DataSnapshot) {
        this.data = data
        this.created_at = Date.now()
    }
}