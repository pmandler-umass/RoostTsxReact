import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, TextInput, Text, SimpleGrid, Box } from "@mantine/core";
const datasets = ["all_stations_v1", "all_stations_v2"];
const stations = ["KAPX", "KBUF", "KGRB"];

/* when we are up to for looping through enums? 
export enum DataSets {
  V1 = "all_stations_v1",
  V2 = "all_stations_v2",
} */

// Info needed to select radar data and tracks
// comments are only for export so are handled separately
export interface DataIdInfo {
  dataset: string; // change to enums
  station: string;
  year: number;
  month: number;
  day: number;
}

export const defaultInput: DataIdInfo = {
  dataset: "",
  station: "",
  year: 1900,
  month: 0,
  day: 0,
};

export function UserInput(
  setDataInfo: Dispatch<SetStateAction<DataIdInfo>>,
  saveComments: Dispatch<SetStateAction<string>>
) {
  const [dataSet, setDataSet] = useState(defaultInput.dataset);
  const [station, setStation] = useState(defaultInput.station);
  const [year, setYear] = useState(defaultInput.year);
  const [month, setMonth] = useState(defaultInput.month);
  const [day, setDay] = useState(defaultInput.day);
  const [comments, setComments] = useState("");

  function makeMenu(items: Array<string>) {
    var menu_items = [];
    for (let i = 0; i < items.length; i++) {
      menu_items.push({ value: items[i], label: items[i] });
    }
    return menu_items;
  }
  const dataSetMenu = makeMenu(datasets);
  const stationMenu = makeMenu(stations);

  useEffect(() => {
    // only call setDataInfo when all the info is in place
    // (except comments - they are optional)
    if (
      dataSet !== defaultInput.dataset &&
      station !== defaultInput.station &&
      year !== defaultInput.year &&
      month !== defaultInput.month &&
      day !== defaultInput.day
    ) {
      var data_info: DataIdInfo = {
        dataset: dataSet,
        station: station,
        year: year,
        month: month,
        day: day,
      };
      setDataInfo(data_info);
      console.log("Updated InfoForm");
    }
    // TODO temporary compile code - remove when date selection is in
    if (year !== 1999) {
      setYear(1999);
      setMonth(10);
      setDay(1);
    }
    // eslint-disable-next-line
  }, [dataSet, station, year, month, day]);

  useEffect(() => {
    // This pushes local comment info up to main app
    // TODO comments may belong w/ Save button in a different container
    saveComments(comments);
    // eslint-disable-next-line
  }, [comments]);

  return (
    <Box maw={300} mx="auto" pb={10}>
      <form>
        <SimpleGrid cols={2}>
          <Text> "Data Sets" </Text>
          <Select
            label="Data Sets"
            placeholder="Pick one"
            data={dataSetMenu}
            onSearchChange={setDataSet}
            searchValue={dataSet}
          />
        </SimpleGrid>
        <SimpleGrid cols={2}>
          <Text> "Radar Stations" </Text>
          <Select
            label="Radar Stations"
            placeholder="Pick one"
            data={stationMenu}
            onSearchChange={setStation}
            searchValue={station}
          />
        </SimpleGrid>
        <TextInput
          label="Comments"
          placeholder="comments"
          value={comments}
          onChange={(event) => setComments(event.currentTarget.value)}
        />
      </form>
    </Box>
  );
}
