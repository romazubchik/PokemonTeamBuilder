// src/stories/Select.stories.tsx
import React from 'react';
import { Meta, Story } from '@storybook/react';
import SelectComponent, { SelectProps } from '../components/Select';


export default {
  title: 'Components/Select',
  component: SelectComponent,
} as Meta;

const Template: Story<SelectProps> = (args) => <SelectComponent {...args} />;

export const Default: Story<SelectProps> = Template.bind({});
Default.args = {
  register: () => {}, 
  setValue: () => {}, 
  onSelect: async (data) => {
    console.log('Selected data:', data);
  },
};

// AnotherStory история
export const AnotherStory: Story<SelectProps> = Template.bind({});
AnotherStory.args = {
  register: () => {},
  setValue: () => {},
  onSelect: async (data) => {
    console.log('Selected data:', data);
  },
};
