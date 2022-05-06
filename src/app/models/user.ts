export interface User {
    id: number,
    nombre: string,
    apellidos: string,
    email: string,
    password: string,
    rutaImagen?: any,
    numAdvertencias?: number,
    adv1?: number,
    adv2?: number,
    activo?: number,
    token_password_reset?: string,
    rol_id: number 
}
