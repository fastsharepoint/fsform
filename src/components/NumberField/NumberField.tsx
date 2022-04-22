import * as React from 'react';
import { BaseField } from '../BaseField/BaseField';


class NumberField extends BaseField {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value !== 'undefined' ? this.props.value : this.props.defaultvalue !== undefined ? this.props.defaultvalue : '',
            fieldinfo: {Required: false, TypeAsString: '', MaxLength: 255, ReadOnlyField: false, Description: ''}
        };
        this.handleChange = this.handleChange.bind(this);
        
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        const required = this.state.fieldinfo.Required ? this.state.fieldinfo.Required : false;
        const disabled = this.state.fieldinfo.ReadOnlyField ? this.state.fieldinfo.ReadOnlyField : false;

        return (
            this.props.mode === 'edit'
            ?
            <input className={'fstextinput'} type='number' data-field={this.props.field} data-type='number' value={this.state.value} onChange={this.handleChange} disabled={disabled} required={required} maxLength={this.state.fieldinfo.MaxLength} />
            :
            <div>{this.state.value}</div>
            );
    }
}

export default NumberField;