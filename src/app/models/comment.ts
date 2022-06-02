export interface Comment {
    id: number,
    texto: string,
    created_at: Date,
    updated_at: Date,
    like: boolean,
    users_id: number,
    pistas_id: number,
}
