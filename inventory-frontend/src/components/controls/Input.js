import React from 'react';
import {TextField} from "@mui/material";

export default function Input(props) {

    const{name, label, value , error = null, onChange, disabled, type, ...other} = props

    return (
        <TextField
            disabled={disabled ? true : false}
            variant="outlined"
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            type={type ? 'number' : 'text'}
            {...other}
            {...(error && {error:true, helperText:error})}
        />
    );
}
