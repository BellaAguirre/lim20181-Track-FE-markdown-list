# Markdown Links

Libreria para verificar el status de los links que coloque en sus archivos de tipo markdown, para realizar dicha
acción deberá escribir en la linea de comando (CLI) de su terminal una ruta y la opción --validate, este hará una
petición HTTP con fetch, devolviendo una respuesta a cada petición realizada. También puedes obtener las estadísticas
de los links validos, rotos y la cantidad total de links existentes.

## Instalar
`npm i @bellasacc/md-links`

## Comandos CLI
`md-links <path-file-or-dir> [options]`

`<path-file-or-dir>` ruta de un archivo o de un directorio.

`[options]` : las opciones son las siguientes:

* `--validate` : con esta opción se hace la petición HTTP.

* `--stats` : aquí obtendremos estadísticas de los links encontrados, como el total y los links unicos.

* `--validate --stats`: este devuelve estadísticas mas completas con el total, unicos y links rotos.

## Versión

0.1.3 

### Ejemplo
Instalando paquete ...
![intalación](https://fotos.subefotos.com/4efbb0fd5a3cfdde1bccee890d8f2b23o.png)

Ahora le pasamos una ruta de un archivo markdown en el CLI

`md-links <path-file-or-dir>`

```sh
$ md-links ./carpeta/README.md
```
![path](https://fotos.subefotos.com/fb28196c8efed2856f2dff9bb2bd3e3ao.png)

#### `--validate`

Aquí le enviaremos la opción `--validate`, escribe la ruta y la opción mencionada.

`md-links <path-file-or-dir> --validate`

```sh
$ md-links ./carpeta/README.md --validate
```
![validate](https://fotos.subefotos.com/540c69718801e0458c761ec722446b92o.png)

#### `--stats`

Aquí le pasaremos la opción `--stats`, escribe la ruta y la opción mencionada.

`md-links <path-file-or-dir> --stats`

```sh
$ md-links ./carpeta/README.md --stats
```
![validate](https://fotos.subefotos.com/384df7b5875ab01c46b106920ec70ac6o.png)

#### `--validate --stats`

También podemos combinar ambas opciones y tendremos estadísticas junta con la respuesta HTTP.

`md-links <path-file-or-dir> --validate --stats`

Ahora escribe la ruta y las opciones mencionadas, nos mostrará el total de links, los unicos y los rotos.

```sh
$ md-links ./carpeta/README.md --stats --validate
```
![validate](https://fotos.subefotos.com/fb4083f5296dc996c889ebd314d78fa5o.png)

### [Backlog de implementación del proyecto](https://github.com/BellaAguirre/lim20181-Track-FE-markdown-list/projects/1)

### [Test: pruebas unitarias](https://github.com/BellaAguirre/lim20181-Track-FE-markdown-list/blob/master/test/md-links.spec.js)