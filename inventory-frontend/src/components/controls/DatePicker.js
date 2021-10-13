import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

export default function DatePicker(props) {
    const{name, label, value, onChange} = props

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>

            <Stack spacing={3}>
                <DesktopDatePicker
                    label={label}
                    inputFormat="dd/MMM/yyyy"
                    className={name}
                    value={value}
                    onChange={date => onChange(convertToDefEventPara(name, date))}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
        </LocalizationProvider>
    );
}
