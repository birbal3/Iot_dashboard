'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ApexCharts from 'apexcharts';
import { Grid } from '@mui/system';

interface SensorData {
  id: number;
  TimeStamp: string;
  payload: PayloadData;
}

interface PayloadData {
  rainStatus: number;
  humidity: number;
  sunlight: number;
  soilMoister: number;
  id: number;
  TimeStamp: string;
}

const schema = zod.object({
  id: zod.number().min(1, { message: 'Id is required' }),
  date: zod
    .any()
    .refine((val) => dayjs.isDayjs(val) && val.isValid(), {
      message: 'Invalid date',
    }),
});

type Values = {
  id: number;
  date: Dayjs | null;
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [filterData, setFilterData] = useState<SensorData[]>([]);

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {
      id: 0,
      date: null,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        'https://g14527fbq1.execute-api.ap-southeast-2.amazonaws.com/data'
      );
      console.log('Fetched data:', res.data);
      setSensorData(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const id = watch('id');
    const date = watch('date')?.format('YYYY/MM/DD');
    const filtered = sensorData.filter((entry) => {
      const entryDate = entry?.TimeStamp.split('/T')[0];
      return entry.id === id && entryDate === date;
    });
    setFilterData(filtered);
    console.log('Filtered data:', filtered);
  }, [watch('date'), watch('id')]);

  const renderChart = (
    elementId: string,
    name: string,
    color: string,
    data: [number, number][]
  ) => {
    const options: ApexCharts.ApexOptions = {
      series: [{ name, data }],
      chart: {
        id: elementId,
        type: 'area',
        height: 300,
        zoom: { autoScaleYaxis: true },
      },
      dataLabels: { enabled: false },
      // markers: { size: 4 },
      xaxis: {
        type: 'datetime',
        title: { text: 'Timestamp' },
      },
      yaxis: {
        title: { text: name },
      },
      tooltip: {
        x: { format: 'dd MMM yyyy HH:mm:ss' },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      colors: [color],
    };

    const chart = new ApexCharts(document.querySelector(`#${elementId}`), options);
    chart.render();
    return chart;
  };

  useEffect(() => {
    if (!filterData.length) return;

    const convertToTimestamp = (ts: string) => new Date(ts.replace('/T', 'T')).getTime();
    function convertToUnixTimestamp(dateString: string): number {
      // Replace '/T' with 'T' to match ISO format
      const isoFormatted = dateString.replace('/T', ';');

      const date = new Date(isoFormatted);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format');
        return 0; // Return 0 or handle the error as needed
      }

      // Return Unix timestamp in milliseconds
      return date.getTime()+19800000;
    }


    const humidityData:[number,number][] = filterData.map((entry) => [
      convertToUnixTimestamp(entry.TimeStamp),
      entry.payload.humidity,
    ]);

    const soilMoistureData:[number,number][] = filterData.map((entry) => [
      convertToUnixTimestamp(entry.TimeStamp),
      entry.payload.soilMoister,
    ]);

    const sunlightData:[number,number][] = filterData.map((entry) => [
      convertToUnixTimestamp(entry.TimeStamp),
      entry.payload.sunlight,
    ]);

    const rainStatusData:[number,number][] = filterData.map((entry) => [
      convertToUnixTimestamp(entry.TimeStamp),
      entry.payload.rainStatus,
    ]);
    console.log('Humidity Data:', humidityData);

    const humidityChart = renderChart('chart-humidity', 'Humidity', '#008FFB', humidityData);
    const moistureChart = renderChart('chart-moisture', 'Soil Moisture', '#00E396', soilMoistureData);
    const sunlightChart = renderChart('chart-sunlight', 'Sunlight', '#FEB019', sunlightData);
    const rainChart = renderChart('chart-rain', 'Rain Status', '#FF4560', rainStatusData);

    return () => {
      humidityChart?.destroy();
      moistureChart?.destroy();
      sunlightChart?.destroy();
      rainChart?.destroy();
    };
  }, [filterData]);

  return (
    <div className="p-6">
      <Grid container spacing={2}>
        <Grid size={1}>
          <Controller
            name="id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Id</InputLabel>
                <Select {...field} label="Id">
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  format='DD/MM/YYYY'
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
      </Grid>

      {filterData.length === 0 && (
        <div style={{display:'flex', textAlign:
'center', justifyContent:'center', marginTop:'20px', color:'black', fontSize:'18px', fontWeight:'bold'
        }}>No data available for selected ID and Date.</div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filterData.length > 0 && (<div style={{height:20, display:'flex',justifyContent:'center',color:'#008FFB', fontSize:'18px', fontWeight:'bold' }}>Humidity</div>)}
        <div id="chart-humidity" />
        {filterData.length > 0 && (<div style={{height:20, display:'flex',justifyContent:'center',color:'#00E396', fontSize:'18px', fontWeight:'bold'}}>Soil Moisture</div>)}
        <div id="chart-moisture" />
        {filterData.length > 0 && (<div style={{height:20, display:'flex',justifyContent:'center',color:'#FEB019', fontSize:'18px', fontWeight:'bold'}}>Sunlight</div>)}

        <div id="chart-sunlight" />
        {filterData.length > 0 && (<div style={{height:20, display:'flex',justifyContent:'center',color:'#FF4560', fontSize:'18px', fontWeight:'bold'}}>Rain</div>)}

        <div id="chart-rain" />
      </div>
    </div>
  );
}
