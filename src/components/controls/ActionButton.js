// import React from 'react';
// import Button from "./Button";
// import {makeStyles} from "@mui/styles";
//
// const useStyles = makeStyles(theme =>({
//     root:{
//         minWidth: 0,
//         margin: 0.5
//     },
//     secondary:{
//         backgroundColor: 'lightGrey',
//         '& .MuiButton-label': {
//             color: 'red'
//         }
//     },
//     primary:{
//         backgroundColor: 'lightBlue',
//         '& .MuiButton-label': {
//             color: 'blue'
//         }
//     }
// }))
//
//
// export default function ActionButton(props) {
//
//     const{color, children, onClick} = props;
//     const classes = useStyles();
//
//     return (
//         <Button
//             // className={`${classes.root} ${classes[color]}`}
//             onClick={onClick}>
//             {children}
//         </Button>
//     );
// }
//
//
