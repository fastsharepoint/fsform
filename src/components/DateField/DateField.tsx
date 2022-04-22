import * as React from 'react';
import {BaseField} from '../BaseField/BaseField';

class DateField extends BaseField {
    constructor(props) {
        super(props);

        //Can't use parseDate, it adds a day
        const currentDate: Date = new Date();
        const currentMonth: string = (currentDate.getMonth() + 1).toString();
        const currentDay: string = (currentDate.getDate()).toString();

        this.state = {
            value: this.props.value !== 'undefined' ? this.parseDate(this.props.value) : (currentDate.getFullYear() + '-' + (currentMonth.length === 1 ? '0' : '' ) + currentMonth + '-' + (currentDay.length === 1 ? '0' : '' ) + currentDay),
            fieldinfo: {Required: false, TypeAsString: '', MaxLength: 255, ReadOnlyField: false, Description: ''}
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: this.parseDate(event.target.value)});
    }

    parseDate(date: string): string {
        const currentDate: Date = new Date(date);
        const currentMonth: string = (currentDate.getMonth() + 1).toString();
        const currentDay: string = (currentDate.getDate() + 1).toString();

        return currentDate.getFullYear() + '-' + (currentMonth.length === 1 ? '0' : '' ) + currentMonth + '-' + (currentDay.length === 1 ? '0' : '' ) + currentDay;
    }

    render() {
        const required = this.state.fieldinfo.Required ? this.state.fieldinfo.Required : false;
        const disabled = this.state.fieldinfo.ReadOnlyField ? this.state.fieldinfo.ReadOnlyField : false;

        return (
            this.props.mode === 'edit' 
            ?
                <input type='date' data-type='date' data-field={this.props.field} value={this.state.value} onChange={this.handleChange} disabled={disabled} required={required}/>
            :
                <div>{this.state.value}</div>
        );
    }
}

export default DateField;