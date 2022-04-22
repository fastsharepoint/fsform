import * as React from 'react';
import { BaseField } from '../BaseField/BaseField';
import { IChoiceFieldValue, IChoices } from '../Types';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';


class SelectChoiceField extends BaseField {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value !== 'undefined' ? this.props.value : this.props.defaultvalue !== undefined ? this.props.defaultvalue : '', 
            choices: [],
            fieldinfo: {Required: false, TypeAsString: '', MaxLength: 255, ReadOnlyField: false, Description: ''}
        };
        this.handleChange = this.handleChange.bind(this);
        this.getFieldChoices(this.props.list, this.props.field);
    }

    public getFieldChoices(list: string, field: string): void {
            this.props.webpartcontext.spHttpClient.get(this.props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('` + list + `')` + `/fields?$filter=EntityPropertyName eq '` + field +`'`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                response.json().then((choices: IChoiceFieldValue) => {
            
                this.setState({choices: choices.value[0].Choices});

            });
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        const options = this.state.choices.map((choice: string, i: number) =>
            <option key={i} value={choice}>{choice}</option>
        );

        const required = this.state.fieldinfo.Required ? this.state.fieldinfo.Required : false;
        const disabled = this.state.fieldinfo.ReadOnlyField ? this.state.fieldinfo.ReadOnlyField : false;

        return (
            this.props.mode === 'edit'
            ?
            <select className={'fsselectinput'} value={this.state.value} onChange={this.handleChange} data-type='choice' data-field={this.props.field} disabled={disabled} required={required}>{options}</select>
            :
            <div className={'fsselectinputvalue'}>{this.state.value}</div>
            );
    }
}

export default SelectChoiceField;