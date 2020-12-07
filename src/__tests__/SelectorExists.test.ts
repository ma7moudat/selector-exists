import {ReaderStdin, SelectorExists} from '../index';

test('No Usages', () => {
  const instance = new SelectorExists();
  expect(instance.getUsages().length).toBe(0);
});

test('STDIN', async () => {
  const instance = new SelectorExists();
  instance.addCssSource(new ReaderStdin(`
    body {
      background-color: #fff;
    }
    div.block {
      font-size: 12px; 
    }
    .missing {
      border: 1px solid red;
    }
  `));
  instance.addHtmlSource(new ReaderStdin(`
    <html lang="en">
        <body>
            <div class="block">Demo</div>
        </body>
    </html>
  `));
  await instance.processUsages();
  expect(instance.getUsages().length).toBe(3);
});
