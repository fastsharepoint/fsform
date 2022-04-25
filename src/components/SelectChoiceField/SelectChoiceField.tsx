import * as React from 'react';
import { useState } from 'react';
import { IChoiceFieldValue } from '../Types';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

function SelectChoiceField(props) {

    const [choices, setChoices] = useState([]);
    const [value, setValue] = useState(props.value !== 'undefined' ? props.value : props.defaultvalue !== undefined ? props.defaultvalue : '');
    const [initiated, setInitiated] = useState(false);

    const getChoices = () => {
        if (!initiated) {
            setInitiated(true);
            props.webpartcontext.spHttpClient.get(props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('` + props.list + `')` + `/fields?$filter=EntityPropertyName eq '` + props.field +`'`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                response.json().then((choices: IChoiceFieldValue) => {
            
                    if (choices.value.length > 0)
                        setChoices(choices.value[0].Choices);

                });
            });
        }
    }

    getChoices();

    const options = choices.map((choice: string, i: number) =>
        <option key={i} value={choice}>{choice}</option>
    );

    return (
        
        props.mode === 'edit' 
        ?
        <select className={'fsselectinput'} value={value} onChange={(e) => setValue(e.target.value)} data-type='choice' data-field={props.field} disabled={props.disabled} required={props.required}>{options}</select>
        :
        <div className={'fsselectinputvalue'}>{value}</div>
    );
}

export default SelectChoiceField;