import type { Meta, StoryObj } from '@storybook/react';

import { WebComponents } from './web-components';

const meta: Meta<typeof WebComponents> = {
  component: WebComponents,
  title: 'WebComponents',
};
export default meta;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Story = StoryObj<typeof WebComponents>;

export const Primary = {
  args: {},
};
