
import {Select, TextInput, Checkbox, Button, Menu, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    IconChevronDown,
  } from '@tabler/icons-react';
const datasets = ['all_stations_v1', 'all_stations_v2'];
const stations = ['KAPX', 'KBUF', 'KGRB'];


export function Demo() {
  const form = useForm({
    initialValues: {
      email: '',
      termsOfService: false,
    },
    
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  
  function ButtonMenu(title: string, items: Array<string>) {
    console.log(items);
    const menu_items = [];      
    for(let i = 0; i<items.length; i++){
        menu_items.push({ value: items[i], label: items[i] })
    } 
    
    return (
        <Select
            label={title}
            placeholder="Pick one"
            data={menu_items}
        />
    );
  }

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {ButtonMenu("Data Sets", datasets)}
        {ButtonMenu("Radar Stations", stations)}
        <Checkbox
          mt="md"
          label="I agree to sell my privacy"
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
