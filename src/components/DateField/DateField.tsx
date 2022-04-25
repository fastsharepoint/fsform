import * as React from 'react';
import { useState } from 'react';

function DateField(props) {

    const parseDate = (date: string): string => {
        const currentDate: Date = new Date(date);
        const currentMonth: string = (currentDate.getMonth() + 1).toString();
        const currentDay: string = (currentDate.getDate() + 1).toString();

        return currentDate.getFullYear() + '-' + (currentMonth.length === 1 ? '0' : '' ) + currentMonth + '-' + (currentDay.length === 1 ? '0' : '' ) + currentDay;
    }

    const currentDate: Date = new Date();
    const currentMonth: string = (currentDate.getMonth() + 1).toString();
    const currentDay: string = (currentDate.getDate()).toString();

    const [value, setValue] = useState(props.value !== 'undefined' ? parseDate(props.value) : (currentDate.getFullYear() + '-' + (currentMonth.length === 1 ? '0' : '' ) + currentMonth + '-' + (currentDay.length === 1 ? '0' : '' ) + currentDay));

    return (
        props.mode === 'edit'
        ?
        <input className={'fstextinput'} type='date' data-field={props.field} data-type='text' value={value}  onChange={(e) => setValue(e.target.value)} disabled={props.disabled} required={props.required} maxLength={props.maxLength} />
        :
        <div>{value}</div>
    );
}

export default DateField;