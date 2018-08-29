const mdLinks = require('../src/index');

jest.setTimeout(10000);
test('deberia retornar un arreglo de objetos con [{url, text, file, valido, status}] para --validate ', () => {
  const options = {
    validate: true,
    stats: false,
  };
  return mdLinks('test/prueba', options).then((response) => {
    expect(response).toEqual([
      {
        url: 'https://github.com/workshopper/learnyounode',
        text: 'learnyounode',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\README.md',
        valido: true,
        status: 200,
      },
      {
        url: 'https://github.com/workshopper/learnyounode',
        text: 'learnyounode',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\README.md',
        valido: true,
        status: 200,
      },
      {
        url: 'https://nodejsor/api/fs.html#fs_fs_readfile_path_options_callback',
        text: 'Leer un archivo',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\otracarpeta\\README.md',
        valido: false,
        status: 404,
      },
      {
        url: 'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
        text: 'Leer un Directorio',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\otracarpeta\\README.md',
        valido: true,
        status: 200,
      }]);
  });
});
test('deberia retornar total: 4, unique : 3 para --stats', () => {
  const options = {
    validate: false,
    stats: true,
  };
  return mdLinks('test/prueba', options).then((response) => {
    expect(response).toEqual({ total: 4, unique: 3 });
  });
});
test('deberia retornar total: 4, unique: 3, broquen 1 para --validate --stats', () => {
  const options = {
    validate: true,
    stats: true,
  };
  return mdLinks('test/prueba', options).then((response) => {
    expect(response).toEqual({ broquen: 1, total: 4, unique: 3 });
  });
});
test('deberia retornar un arreglo de objetos con  [{url, text, file}]', () => {
  const options = {
    validate: false,
    stats: false,
  };
  return mdLinks('test/prueba', options).then((response) => {
    expect(response).toEqual([
      {
        url: 'https://github.com/workshopper/learnyounode',
        text: 'learnyounode',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\README.md',
      },
      {
        url: 'https://github.com/workshopper/learnyounode',
        text: 'learnyounode',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\README.md',
      },
      {
        url: 'https://nodejsor/api/fs.html#fs_fs_readfile_path_options_callback',
        text: 'Leer un archivo',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\otracarpeta\\README.md',
      },
      {
        url: 'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
        text: 'Leer un Directorio',
        file: 'C:\\Users\\Bella Sheryl Aguirre\\Documents\\lim20181-Track-FE-markdown-list\\test\\prueba\\otracarpeta\\README.md',
      }]);
  });
});
