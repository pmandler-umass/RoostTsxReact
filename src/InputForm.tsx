import { Select, TextInput, Text, SimpleGrid, Box } from "@mantine/core";
const datasets = ["all_stations_v1", "all_stations_v2"];
const stations = ["KAPX", "KBUF", "KGRB"];

export function UserInput() {
  function ButtonMenu(title: string, items: Array<string>) {
    const menu_items = [];
    for (let i = 0; i < items.length; i++) {
      menu_items.push({ value: items[i], label: items[i] });
    }

    return (
      <SimpleGrid cols={2}>
        <Text> {title} </Text>
        <Select label={title} placeholder="Pick one" data={menu_items} />
      </SimpleGrid>
    );
  }

  return (
    <Box maw={300} mx="auto">
      <form>
        {ButtonMenu("Data Sets", datasets)}
        {ButtonMenu("Radar Stations", stations)}
        <TextInput label="comments" placeholder="comments" />
      </form>
    </Box>
  );
}
