import * as React from 'react';
import { useState } from 'react';
import { IUsers, IUser } from '../Types';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

function SelectUserField(props) {

    const [users, setUsers] = useState([]);
    const [value, setValue] = useState(props.value !== 'undefined' ? props.value : props.defaultvalue !== undefined ? props.defaultvalue : '');
    const [initiated, setInitiated] = useState(false);

    const getUsers = () => {
        if (!initiated) {
            setInitiated(true);
            props.webpartcontext.spHttpClient.get(props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/siteusers?$filter=PrincipalType eq 1 and UserPrincipalName ne null`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
               response.json().then((users: IUsers) => {
   
                  setUsers(users.value);
   
              });
          });
        }

    }

    getUsers();


    const options = users.map((user: IUser, i: number) =>
        <option key={i} value={user.Id}>{user.Title}</option>
    );

    return (
        
        props.mode === 'edit' 
        ?
        <select className={'fsselectinput'} value={value} onChange={(e) => setValue(e.target.value)} data-type='user' data-field={props.field} disabled={props.disabled} required={props.required}>{options}</select>
        :
        <div className={'fsselectinputvalue'}>{value}</div>
    );
}

export default SelectUserField;