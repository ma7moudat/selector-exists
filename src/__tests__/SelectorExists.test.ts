import {SelectorExists} from '../SelectorExists';

test('No Usages', () => {
  const instance = new SelectorExists();
  expect(instance.getUsages().length).toBe(0);
});