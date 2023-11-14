export type Proceso = {
    id: number | string,
    nombre: string,
    tiempo_de_arribo: number,
    cantidad_de_rafagas: number,
    duracion_rafaga_cpu: number,
    duracion_rafaga_io: number,
    prioridad: number | string,
}