Storage API
===
It is a solution for task described in storage.md<br>
Allows to perform basic operations on directories and files in the directory specified in the `.env` file

Setup and Running 
===

```bash
$ npm install
$ tsc
$ node ./dist/app.js
```

Env file
===
- `PORT` - Port on which the API will be exposed
- `ROOT_DIR` - Root directory for the file storage

Endpoints
===

#### Creating file
<details>
 <summary><code>POST <b>/</b>create_file</code></summary>

##### Body Parameters

> | name      |  type     | data type | description                     |
> |-----------|-----------|-----------|---------------------------------|
> | path      |  required | string    | new file path                   |
> | encoding  |  required | string    | encoding of content             |
> | content   |  required | string    | content of the file             |

###### Note
`encoding` has to be one of:
- `ascii`
- `utf8`
- `utf-8`
- `utf16le`
- `utf-16le`
- `ucs2`
- `ucs-2`
- `base64`
- `base64url`
- `latin1`
- `binary`
- `hex`

##### Responses

> | http code | reason                                                                                |
> |-----------|---------------------------------------------------------------------------------------|
> | `201`     | File created successfully                                                             | 
> | `400`     | One or more parameters missing                                                        |
> | `403`     | Trying to create file in `/admin` (sub)directory without role header set to `admin`   |
> | `404`     | Directory doesn't exist                                                               | 
> | `409`     | File already exists                                                                   | 

##### Example cURL creating `/abc/file.txt` file with `Hello world!` text

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/create_file -d "{\"path\":\"/abc/file.txt\",\"encoding\":\"utf8\",\"content\":\"Hello world!\"}"
> ```

</details>

#### Creating directory
<details>
 <summary><code>POST <b>/</b>create_directory</code></summary>

##### Body Parameters

> | name      |  type     | data type | description                     |
> |-----------|-----------|-----------|---------------------------------|
> | path      |  required | string    | new directory path              |

##### Responses

> | http code | reason                                                                                    |
> |-----------|-------------------------------------------------------------------------------------------|
> | `201`     | Directory created successfully                                                            | 
> | `400`     | path parameter missing                                                                    |
> | `403`     | Trying to create directory in `/admin` (sub)directory without role header set to `admin`  |
> | `409`     | Directory already exists                                                                  | 

##### Example cURL creating `/abc/file.txt` file with `Hello world!` text

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/create_directory -d "{\"path\":\"/abc/qwe\"}"
> ```

</details>

#### Reading file
<details>
 <summary><code>POST <b>/</b>read_file</code></summary>

##### Body Parameters

> | name      |  type     | data type | description                     |
> |-----------|-----------|-----------|---------------------------------|
> | path      | required  | string    | relative path to the file       |

##### Responses

> | http code | reason                                                                      |
> |-----------|-----------------------------------------------------------------------------|
> | `200`     | File read sucessfully                                                       | 
> | `400`     | Path parameter is missing                                                   |
> | `403`     | Trying to access file in `/admin` folder without role header set to `admin` |
> | `404`     | File doesn't exists                                                         | 

##### Example cURL reading `file.txt` located in root directory

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/read_file -d "{\"path\":\"file.txt\"}"
> ```

##### Example cURL reading `file.txt` located in directory `/abc/qwe`

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/read_file -d "{\"path\":\"/abc/qwe/file.txt\"}"
> ```

</details>

#### Listing contents of directory
<details>
 <summary><code>POST <b>/</b>read_directory</code></summary>

##### Body Parameters

> | name      |  type     | data type | description                     |
> |-----------|-----------|-----------|---------------------------------|
> | path      |  required | string    | relative path to the file       |

##### Responses

> | http code | reason                                                                      |
> |-----------|-----------------------------------------------------------------------------|
> | `200`     | Directory read sucessfully                                                  | 
> | `400`     | Path parameter is missing                                                   |
> | `403`     | Trying to read directory `/admin` without role header set to `admin`        |
> | `404`     | Directory doesn't exists                                                    | 

##### Example cURL reading root directory content

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/read_directory -d "{\"path\":\"/\"}"
> ```

##### Example cURL reading content of `/abc/qwe` directory

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/read_directory -d "{\"path\":\"/abc/qwe\"}"
> ```

</details>

#### Moving and renaming of directory or file
<details>
 <summary><code>POST <b>/</b>move</code></summary>

##### Body Parameters

> | name      |  type     | data type | description                     |
> |-----------|-----------|-----------|---------------------------------|
> | fromPath  |  required | string    | file/directory to rename        |
> | toPath    |  required | string    | new name of the file/directory  |

##### Responses

> | http code | reason                                                                                |
> |-----------|---------------------------------------------------------------------------------------|
> | `200`     | File/directory renamed successfully                                                   | 
> | `400`     | fromPath and/or toPath parameter is missing                                           |
> | `403`     | Trying to rename directory `/admin` or its content without role header set to `admin` |
> | `404`     | File/directory specified in fromPath parameter doesn't exist                          | 
> | `409`     | File/directory specified in toPath parameter already exists                           | 

##### Example cURL renaming folder `/abc/qwe` to `/abc/ewq`

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/move -d "{\"fromPath\":\"/abc/qwe\",\"toPath\":\"/abc/ewq\"}"
> ```

##### Example cURL moving file `/abc/qwe/file.txt` to `/file.txt`

> ```javascript
>  curl -X POST -H "Content-Type: application/json" localhost:3000/move -d "{\"fromPath\":\"/abc/qwe/file.txt\",\"toPath\":\"/file.txt\"}"
> ```

</details>

#### Deleting directory or file
<details>
 <summary><code>DELETE <b>/</b>move</code></summary>

##### Body Parameters

> | name      |  type     | data type | description                     |
> |-----------|-----------|-----------|---------------------------------|
> | path      |  required | string    | file/directory to remove        |

##### Responses

> | http code | reason                                                                                |
> |-----------|---------------------------------------------------------------------------------------|
> | `200`     | File/directory deleted successfully                                                   | 
> | `400`     | path parameter is missing                                                             |
> | `403`     | Trying to remove directory `/admin` or its content without role header set to `admin` |
> | `404`     | File/directory specified in path parameter doesn't exist                              |

##### Example cURL removing folder `/abc/qwe`

> ```javascript
>  curl -X DELETE -H "Content-Type: application/json" localhost:3000/delete -d "{\"path\":\"/abc/qwe\"}"
> ```

##### Example cURL removing file `/abc/qwe/file.txt`

> ```javascript
>  curl -X DELETE -H "Content-Type: application/json" localhost:3000/delete -d "{\"path\":\"/abc/qwe/file.txt\"}"
> ```

</details>
