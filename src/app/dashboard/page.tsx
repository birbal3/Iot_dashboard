import * as React from 'react';
import type { Metadata } from 'next';
import { Stack } from '@mui/system';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import Item
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import Dashboard from '@/components/dashboard/overview/dashboard';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
     <Dashboard/>
    </Stack>
  );
}
