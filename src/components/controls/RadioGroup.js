import React from 'react';
import {FormControl, FormLabel, FormHelperText, Radio, RadioGroup as MuiRadioGroup} from "@mui/material";
import { FormControlLabel } from '@material-ui/core';

export default function RadioGroup(props) {

    const{name, label, value , error = null, onChange, items, disabled, ...other} = props

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <MuiRadioGroup row
                disabled
                name={name}
                value={value}
                onChange={onChange}>
                {
                    items.map(
                        (item, index) => (
                            <FormControlLabel disabled={disabled ? true : false} value={item.id} control={<Radio/>} label={item.title}/>
                        )
                    )
                }
            </MuiRadioGroup>
            {error && <FormHelperText style={{color:'red'}}>{error}</FormHelperText>}
        </FormControl>
        
    );
}