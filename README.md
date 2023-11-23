# integrador-sistemas-operativos

## Ejecutar

```bash
$ cd planificacion_del_procesador
$ npm install
$ npm run start
```

## Tanda de procesos

Los archivos con las tandas de procesos tienen el siguiente formato:

```text
#COMENTARIO: TANDA DE PRUEBA
#NOMBRE_PROCESO     ;#TIEMPO_ARRIBO     ;#CANTIDAD_RAFAGAS      ;#DURACION_RAFAGAS_CPU      ;#DURACION_RAFAGAS_IO       ;#PRIORIDAD
Proc1               ;2                  ;4                      ;2                          ;3                          ;1
Proc2               ;3                  ;5                      ;3                          ;4                          ;2
Proc3               ;4                  ;6                      ;7                          ;4                          ;2
#NOMBRE_PROCESO     ;#TIEMPO_ARRIBO     ;#CANTIDAD_RAFAGAS      ;#DURACION_RAFAGAS_CPU      ;#DURACION_RAFAGAS_IO       ;#PRIORIDAD
```
