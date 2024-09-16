
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fetchfarmer, fetchfarm, fetchcrops, fetchvariety } from '@/lib/apifetch/farmer-fetch';
import dayjs, { Dayjs } from 'dayjs';
import { z as zod } from 'zod'

// Constants for Measurement
const measurement = [
  { value: 'centimeter', label: 'cm' },
  { value: 'feet', label: 'ft' }
] as const;

export interface Farmer {
  id: number,
  name: string,
  phone_number: string
}
export interface Farm {
  id: number,
  current_crop: string,
  farm_name: string,
  sowing_date: Date,
  area: number,
  user_id: string,
}
export interface Crop {
  id: number,
  crop_name: string,
  crop_type:string
}
export interface Variety {
  id: number,
  variety: string,
}

// Define form data types
const schema = zod.object({
  farmer: zod.string().min(1, { message: 'Farmer Search is required' }),
  currentFarmer: zod.string().min(1, { message: 'Farmer Selection is required' }),
  currentFarm: zod.string().min(1, { message: 'Farm Selection is required' }),
  crop: zod.string().min(1, { message: 'Crop is required' }),
  variety: zod.string().min(1, { message: 'Variety is required' }),
  sowing: zod.date({ required_error: 'Sowing Date is required' }).nullable(),
  transplanting: zod.date({ required_error: 'Transplanting Date is required' }).nullable(),
  pruning: zod.date({ required_error: 'Pruning Date is required' }).nullable(),
  ageofcrop: zod.number().min(1, { message: 'Age of Crop is required' }),
  rows: zod.number().min(1, { message: 'Number of Rows is required' }),
  plants: zod.number().min(1, { message: 'Number of Plants is required' }),
  spacing: zod.number().min(1, { message: 'Row Spacing is required' }),
  unit: zod.string().min(1, { message: 'Unit is required' }),
});
type Values = zod.infer<typeof schema>;
export function CropInitialisation(): React.JSX.Element {
  const [farmerList, setFarmerList] = useState<Farmer[]>([]);
  const [farmList, setFarmList] = useState<Farm[]>([]);
  const [cropList, setCropList] = useState<Crop[]>([]);
  const [varietyList, setVarietyList] = useState<Variety[]>([]);
  const [cropType, setCropType] = useState<string>();
  const [isPending,setIsPending]=useState<boolean>();

  const { control, handleSubmit, setValue, setError,watch, formState: { errors } } = useForm<Values>({
    defaultValues: {
      farmer: '',
      currentFarmer: '',
      currentFarm: '',
      crop:'',
      variety: '',
      sowing: null,
      transplanting: null,
      pruning: null,
      ageofcrop: 0,
      rows: 0,
      plants: 0,
      spacing: 0,
      unit: 'centimeter'
    }, resolver: zodResolver(schema)
  });

  const fetchFarmer = async (farmer: string) => {
    const res = await fetchfarmer(farmer);
    if(res?.data?.success)
    setFarmerList(res.data.result);
  };

  // Fetch farms when a farmer is selected
  useEffect(() => {
    const currentFarmer = watch('currentFarmer');
    if (currentFarmer) {
      const fetchFarms = async () => {
        const res = await fetchfarm(currentFarmer);
        console.log(res)
        if(res?.data?.success)
        setFarmList(res?.data?.farms);
      };
      fetchFarms();
    }
  }, [watch('currentFarmer')]);

  // Fetch crops when a farm is selected
  useEffect(() => {
    const currentFarm = watch('currentFarm');
    if (currentFarm) {
      const fetchCrops = async () => {
        const res = await fetchcrops();
        console.log(res)
        if(res?.data?.success)
        setCropList(res?.data?.result);
      };
      fetchCrops();
    }
  }, [watch('currentFarm')]);

  // Fetch variety when a crop is selected
  useEffect(() => {
    const crop = watch('crop');
    if (crop) {
      const fetchVariety = async () => {
        const res = await fetchvariety(crop);
        if(res?.data?.success)
        setVarietyList(res?.data?.result);
        const el =cropList.find(function (element) {
          return element.crop_name === watch('crop');})
          setCropType(el?.crop_type);
      };
      fetchVariety();
    }
  }, [watch('crop')]);


  const onSubmit: SubmitHandler<Values> = async (data) => console.log(data)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Initialize farm data collection by setting up the crop here." title="Crop Initialisation" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* SEARCH BAR */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="farmer"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Farmer Search</InputLabel>
                    <OutlinedInput {...field} label="Search Farmer" />
                  </FormControl>
                )}
              />
            </Grid>
            <Grid size={{ sm: 6, xs: 12 }}>
              <Button variant="outlined" onClick={() => fetchFarmer(watch('farmer'))} color="primary">Load Farmers</Button>
            </Grid>

            {/* Farmer Dropdown */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="currentFarmer"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Farmer</InputLabel>
                    <Select {...field} label="Farmer">
                      {farmerList.length > 0 ? farmerList.map((el) => (
                        <MenuItem key={el.id} value={el.id}>{el.name}</MenuItem>
                      )) : <MenuItem disabled>No Farmers Available</MenuItem>}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Farm Dropdown */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="currentFarm"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Farm</InputLabel>
                    <Select {...field} label="Farm">
                      {farmList.length > 0 ? farmList.map((el) => (
                        <MenuItem key={el.id} value={el.id}>{el.farm_name}</MenuItem>
                      )) : <MenuItem disabled>No Farms Available</MenuItem>}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Crop Dropdown */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="crop"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Crop</InputLabel>
                    <Select {...field} label="Crop">
                      {cropList.length > 0 ? cropList.map((el) => (
                        <MenuItem key={el?.crop_name} value={el.crop_name}>{el.crop_name}</MenuItem>
                      )) : <MenuItem disabled>No Crops Available</MenuItem>}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Variety Dropdown */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="variety"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Variety</InputLabel>
                    <Select {...field} label="Variety">
                      {varietyList.length > 0 ? varietyList.map((el) => (
                        <MenuItem key={el?.variety} value={el.variety}>{el.variety}</MenuItem>
                      )) : <MenuItem disabled>No Varieties Available</MenuItem>}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            {cropType==='ST'?(
              <>  
               {/*  Sowing Date */}
            <Grid size={{ sm: 6, xs: 12 }}>
            <Controller
              name="sowing"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker {...field} label="Sowing Date" />
                </LocalizationProvider>
              )}
            />
          </Grid>
          </>
            )
            :<></>
            }
            {cropType==='ST'||cropType==='MT'?(
              <>  
             {/* Transplanting Date */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="transplanting"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker {...field} label="Transplanting Date" />
                  </LocalizationProvider>
                )}
              />
            </Grid>
            </>
            )
            :<></>
            }

            {cropType==='LT' || cropType==='MT'?(<>
            {/* Pruning Month */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="pruning"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker {...field} label="Pruning Date" />
                  </LocalizationProvider>
                )}
              />
            </Grid></>):<></>}
            {cropType==='LT'||cropType==='MT'?(<>
            {/* Age of Crop */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="ageofcrop"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Age of Crop (Years)" type="number" fullWidth />
                )}
              />
            </Grid></>):<></>
            }

            {/* Number of Rows */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="rows"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Number of Rows" type="number" fullWidth />
                )}
              />
            </Grid>

            {/* Number of Plants */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="plants"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Number of Plants" type="number" fullWidth />
                )}
              />
            </Grid>

            {/* Crop Spacing */}
            <Grid size={{ sm: 6, xs: 12 }}>
              <Controller
                name="spacing"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Crop Spacing" type="number"  />
                )}
              />
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Unit" >
                    {measurement.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">Save Crop</Button>
        </CardActions>
      </Card>
    </form>
  );
}
