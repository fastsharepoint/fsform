import * as React from 'react';
import { BaseField } from '../BaseField/BaseField';
import { IUsers, IUser } from '../Types';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';

class SelectUserField extends BaseField {
    constructor(props) {
        super(props);
        
        this.state = {
            value: this.props.value !== 'undefined' ? this.props.value : this.props.defaultvalue !== undefined ? this.props.defaultvalue : '', 
            users: [],
            fieldinfo: {Required: false, TypeAsString: '', MaxLength: 255, ReadOnlyField: false, Description: ''}
        };
        this.handleChange = this.handleChange.bind(this);
        this.getUsers();
    }

    public getUsers(): void {
         this.props.webpartcontext.spHttpClient.get(this.props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/siteusers?$filter=PrincipalType eq 1 and UserPrincipalName ne null`, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
             response.json().then((users: IUsers) => {

                this.setState({users: users.value});

            });
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        const options = this.state.users.map((user: IUser, i: number) =>
            <option key={i} value={user.Id}>{user.Title}</option>
        );

        const required = this.state.fieldinfo.Required ? this.state.fieldinfo.Required : false;
        const disabled = this.state.fieldinfo.ReadOnlyField ? this.state.fieldinfo.ReadOnlyField : false;

        return (
            this.props.mode === 'edit' 
            ?
            <select className={'fsselectinput'} value={this.state.value} onChange={this.handleChange} data-type='user' data-field={this.props.field} disabled={disabled} required={required}>{options}</select>
            :
            <div className={'fsselectinputvalue'}>{this.state.value}</div>
            );
    }
}

export default SelectUserField;