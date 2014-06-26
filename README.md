attach-parser [![Build Status](https://travis-ci.org/golyshevd/attach-parser.svg?branch=master)](https://travis-ci.org/golyshevd/attach-parser)
=============

http-body stream (req) parsing like a boss

Парсер представляет собой класс для парсинга тел входящих http-запросов
```js
var parser = new AttachParser(params);
```

Особое внимание следует уделить формату параметров парсера. Обязательным параметром является ```params.length```, 
который можно получить из заголовка ```content-length```. Для того чтобы прозрачно работать с парсером при любых типах запросов, AttachParser умеет отдавать парсер-пустышку, если не передать ```length```.
Остальные параметры - это результат парсинга заголовка ```content-type```. Рекмендуется воспользоваться для этого модулем [media-typer](https://www.npmjs.org/package/media-typer).

То есть в целом, чтобы работать с телом запроса достаточно распарсить ```content-type``` и примиксовать к нему ```length```.
```js
// ***
var mediaTyper = require('media-typer');
var AttachParser = require('attach-parser');
var params = mediaTyper(req.headers['content-type'])
var parser;

//  Если длина тела не совпадет с переданной то будет ошибка
params.length = req.headers['content-length'];
//  params.limit = 42; можно ограничить размер тела, тогда будет ошибка при превышении
parser = new AttachParser(params);

//  возвращает promise
parser.parse(req).then(function (data) {
  assert('string' === typeof data.type); // multipart|json|urlencoded|raw или undefined если не передан length
  assert('object' === typeof data.input); // поля запроса
  //  Если type = multipart то будет еще один объект data.files
});
```

Парсер можно расширить своими типами, см. код.
