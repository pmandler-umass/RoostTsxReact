import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Group, Select, SimpleGrid, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

// TODO currently hardcoded - would like to make it parse the directories to get
// the actual datasets that are currently available and
// set the stations accordingly. May need python backend to work.
// SHORTCUT - choose which datasets we want to let people use, hardcode stations per dataset.
// Code for parsing directory structure should be in radarDisplay
const datasets = ['all_stations_v1', 'all_stations_v2'];
const stations = ['KAPX', 'KBUF', 'KGRB'];

// Info needed to select radar data and tracks
// comments are only for export so are handled separately
export interface DataIdInfo {
  dataset: string; // change to enums
  station: string;
  year: number;
  month: number;
  day: number;
}

// default values make it easier to create instance
export const defaultInput: DataIdInfo = {
  dataset: '',
  station: '',
  year: 0,
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
  const [comments, setComments] = useState('');
  // PAM TODO replace year/month/day w. date - parse it out in radarDisplay.
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

  function skipAll() {
    // dataSet, station, year, month, day
    setDataSet(datasets[0]);
    setStation(stations[0]);
    setYear(2010);
    setMonth(10);
    setDay(2);
  }

  useEffect(() => {
    skipAll();
  }, []);

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
    <SimpleGrid cols={2}>
      <Select
        label='Data Sets'
        placeholder='Pick one'
        data={dataSetMenu}
        onSearchChange={setDataSet}
        searchValue={dataSet}
        size='lg'
      />
      <Select
        label='Radar Stations'
        placeholder='Pick one'
        data={stationMenu}
        onSearchChange={setStation}
        searchValue={station}
        size='lg'
      />
      <Group position='center'>
        <DatePicker
          value={thisDate}
          onChange={setThisDate}
          defaultLevel='decade'
        />
      </Group>
      <TextInput
        label='Comments'
        placeholder='comments'
        value={comments}
        onChange={(event) => setComments(event.currentTarget.value)}
        size='lg'
      />
      <Button onClick={() => skipAll()}> Skip </Button>
    </SimpleGrid>
  );
}
