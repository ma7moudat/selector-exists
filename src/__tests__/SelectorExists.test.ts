import http, {Server} from 'http';
import {ReaderStdin, ReaderFilesystem, ReaderUrl, SelectorExists} from '../index';

const stdinCss = `
  body {
    background-color: #fff;
  }
  div.block {
    font-size: 12px; 
  }
  .missing {
    border: 1px solid red;
  }
`;

const stdinHtml = `
  <html lang="en">
      <body>
          <div class="block">Demo</div>
      </body>
  </html>
`;

const server = (() => {
  let app: Server;
  return {
    async start() {
      app = await http.createServer((req, res) => {
        const isStyle = req.url === '/style.css';
        res.writeHead(200, {'Content-Type': isStyle ? 'text/css' : 'text/html'});
        res.end(isStyle ? stdinCss : stdinHtml);
      });
      //
      await app.listen(3333);
    },
    async stop() {
      await app.close();
    },
  };
})();

beforeAll(() => {
  return server.start();
});

afterAll(() => {
  return server.stop();
});

test('No Usages', () => {
  const instance = new SelectorExists();
  expect(instance.getUsages().length).toBe(0);
});

test('Stdin', async () => {
  const instance = new SelectorExists();
  instance.addCssSource(new ReaderStdin(stdinCss));
  instance.addHtmlSource(new ReaderStdin(stdinHtml));
  await instance.processUsages();
  expect(instance.getUsages().length).toBe(3);
});

test('Filesystem', async() => {
  const instance = new SelectorExists();
  instance.addCssSource(new ReaderFilesystem('./demos/**/*.css'));
  instance.addHtmlSource(new ReaderFilesystem('./demos/**/*.html'));
  await instance.processUsages();
  expect(instance.getUsages().length).toBe(45);
});

test('URLs', async() => {
  const instance = new SelectorExists();
  instance.addCssSource(new ReaderUrl('http://127.0.0.1:3333/style.css'));
  instance.addHtmlSource(new ReaderUrl('http://127.0.0.1:3333/'));
  await instance.processUsages();
  expect(instance.getUsages().length).toBe(3);
});