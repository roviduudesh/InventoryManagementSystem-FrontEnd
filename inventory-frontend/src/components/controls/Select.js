import React from 'react';
import {FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect} from "@mui/material";

export default function Select(props) {

    const {name, label, value, error = null, onChange, options, disabled} = props;
    
    return (
        <FormControl variant='outlined'
         {...(error && {error:true})}
        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect 
                disabled={disabled ? true : false}
                label={label}
                name={name}
                value={value}
                onChange={onChange}>
                {/* <MenuItem value="">None</MenuItem> */}
                {
                    options.map(
                        item => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                    )
                }
            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

    );
}
 