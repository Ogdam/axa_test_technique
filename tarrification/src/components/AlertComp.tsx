import { Alert } from "@mui/material";
import React from "react";


interface AlertCompProps {
    errorMessage: string | null;
    infoMessage: string | null;
}

function AlertComp(props : AlertCompProps) {

    return (
        <div>
        {props.errorMessage && (
        <Alert sx={{ zIndex: 2000, position: 'absolute', top: 0, right: '50%', width: '300px' }}
            severity="error"
        >
            {props.errorMessage}
        </Alert>
        )}
        {props.infoMessage && (
        <Alert sx={{ zIndex: 2000, position: 'absolute', top: 0, right: '50%', width: '300px' }}
            severity="info"
        >
            {props.infoMessage}
        </Alert>
        )}
    </div>
    )
}
export default AlertComp;