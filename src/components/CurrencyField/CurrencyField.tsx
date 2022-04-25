import * as React from 'react';
import { useState } from 'react';

function CurrencyField(props) {

    const [value, setValue] = useState(props.value !== 'undefined' ? props.value : props.defaultvalue !== undefined ? props.defaultvalue : '');

    return (
        props.mode === 'edit'
        ?
        <input className={'fstextinput'} type='number' data-field={props.field} data-type='currency' min="1" step="any" value={value}  onChange={(e) => setValue(e.target.value)} disabled={props.disabled} required={props.required} maxLength={props.maxLength} />
        :
        <div>{value}</div>
    );
}

export default CurrencyField;