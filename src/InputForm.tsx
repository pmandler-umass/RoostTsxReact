import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Box, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from '@mantine/dates';
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
  const [thisDate, setThisDate] = useState<Date | null>(null);

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
    }
    // eslint-disable-next-line
  }, [dataSet, station, year, month, day]);

  useEffect(() => {
    if (thisDate) {
      setYear(thisDate.getFullYear());
      setMonth(thisDate.getMonth());
      setDay(thisDate.getDay());
    }
  }, [thisDate]);

  useEffect(() => {
    // This pushes local comment info up to main app
    // TODO comments may belong w/ Save button in a different container
    saveComments(comments);
    // eslint-disable-next-line
  }, [comments]);

  return (
    <Box miw={300} mx="auto" pb={10}>
      <form>
        <Select
          label="Data Sets"
          placeholder="Pick one"
          data={dataSetMenu}
          onSearchChange={setDataSet}
          searchValue={dataSet}
          size="lg"
        />
        <Select
          label="Radar Stations"
          placeholder="Pick one"
          data={stationMenu}
          onSearchChange={setStation}
          searchValue={station}
          size="lg"
        />
        <Group position="center">
          <DatePicker value={thisDate} onChange={setThisDate} defaultLevel="decade" />
        </Group>
        <TextInput
          label="Comments"
          placeholder="comments"
          value={comments}
          onChange={(event) => setComments(event.currentTarget.value)}
          size="lg"
        />
      </form>
    </Box>
  );
}
