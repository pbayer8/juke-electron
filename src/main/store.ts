import Store from 'electron-store';

const schema = {
  theme: {
    type: 'string' as const,
  },
};

export const store = new Store({
  schema,
  defaults: { theme: 'frog' },
});
