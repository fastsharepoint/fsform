import { isControlled } from 'office-ui-fabric-react';
import * as React from 'react';
import { BaseField } from '../BaseField/BaseField';
import { IRepeaterFieldSchema, IRepeaterRow, IRepeaterColumn, RepeaterControlType } from '../Types';
import styles from './RepeaterField.module.scss';



class RepeaterField extends BaseField {
    constructor(props) {
        super(props);

        if (this.props.value !== 'undefined')
            this.state = {schema: JSON.parse(this.props.value), json: this.props.value};
        else {
            this.state = {schema: this.props.schema, json: this.props.value};
        }
            
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleAddClick(event) {
        
        this.setState(prevState => {

            let newschema: IRepeaterFieldSchema = {rows: []};
            let newjson = '';

            if (this.props.schema.rows.length > 0)
            {
                let row: IRepeaterRow = {columns: []}

                this.props.schema.rows[0].columns.forEach((column) => {
                    
                    const newcolumn: IRepeaterColumn = {label: column.label, control: column.control, defaultvalue: column.defaultvalue, value: ''};

                    row.columns.push(newcolumn);

                });

                const newrows = [...prevState.schema.rows, row];
                newschema.rows = newrows;

                newjson = JSON.stringify(this.state.schema);
            }

            return {
                schema: newschema, 
                json: newjson 
            }
        });
    }

    handleRemoveClick(index: number, event) {
        this.setState(prevState => {
            const newrows = [...prevState.schema.rows];
            newrows.splice(index, 1);
            const newschema: IRepeaterFieldSchema = {rows: newrows};

            const newjson = JSON.stringify(newschema);

            return {
                schema: newschema,
                json: newjson
            }
        });
    }

    handleInputChange(rowindex: number, columnindex: number, event) {
        if (event.target !== null) {
            if (event.target.value != null) {
                const val = event.target.value;
                this.setState(prevState => {
                    const newrows = [...prevState.schema.rows];
                    newrows[rowindex].columns[columnindex].value = val;
                    const newschema: IRepeaterFieldSchema = {rows: newrows};
                    const newjson = JSON.stringify(this.state.schema);

                    return {
                        schema: newschema,
                        json: newjson
                    }
                });
            }
        }
    }

    getFieldCount(): string {
        if (this.state.schema.rows.length > 0) {
            const totalcolumns = this.state.schema.rows[0].columns.length;
            switch (totalcolumns) {
                case 1:
                    return styles.repeater_field_body_row_field_one;
                case 2:
                    return styles.repeater_field_body_row_field_two;
                case 3:
                    return styles.repeater_field_body_row_field_three;                    
                default:
                    return '';
            }
        }
        else
        return '';
    }

    render() {
        let columns: JSX.Element[] = [];
        

        if (this.state.schema.rows.length > 0) {
            columns = this.state.schema.rows[0].columns.map((field: IRepeaterColumn, i: number) =>
            <div className='fsrepeaterlabel'><span>{field.label}</span></div>
            );
        }


        const selectoptions = (defaultvalues: string[]) : JSX.Element[] => {
            return defaultvalues.map((value) => 
                <option value={value}>{value}</option>
            );
        }

        const fields = (row: IRepeaterRow, rowindex: number): JSX.Element[] => {
            return row.columns.map((column: IRepeaterColumn, columnindex: number) =>
            column.control === RepeaterControlType.text ? <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}><input type='text' value={row.columns[columnindex].value} onChange={(e) => this.handleInputChange(rowindex, columnindex, e)}></input></div> :
            column.control === RepeaterControlType.multiline ? <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}><textarea value={row.columns[columnindex].value} onChange={(e) => this.handleInputChange(rowindex, columnindex, e)}></textarea></div> : 
            column.control === RepeaterControlType.choice ? <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}><select value={row.columns[columnindex].value} onChange={(e) => this.handleInputChange(rowindex, columnindex, e)}>{selectoptions(column.defaultvalue)}</select></div> :
            column.control === RepeaterControlType.number ? <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}><input type='number' value={row.columns[columnindex].value} onChange={(e) => this.handleInputChange(rowindex, columnindex, e)}></input></div> :
            column.control === RepeaterControlType.currency ? <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}><input type='number' min="1" step="any" value={row.columns[columnindex].value} onChange={(e) => this.handleInputChange(rowindex, columnindex, e)}></input></div> :
            <div className={styles.repeater_field_body_row_field}></div>
            );
        }

        const displayModeValues = (row: IRepeaterRow, rowindex: number): JSX.Element[] => {
            return row.columns.map((column: IRepeaterColumn, columnindex: number) =>
            <div className={'fsrepeatercolumn ' + styles.repeater_field_body_row_field}>{row.columns[columnindex].value}</div>
            );
        }

        const labels = 
        <div className={'fsrepeaterlabel ' + styles.repeater_field_body_row}>
            {this.state.schema.rows.length > 0 ?
            this.state.schema.rows[0].columns.map((column) =>
            <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}>{column.label}</div>
        ) : <div></div>}
        </div>;
        

        const rows = this.state.schema.rows.map((row: IRepeaterRow, rowindex: number) =>
            <div className={'fsrepeaterrow ' + styles.repeater_field_body_row}>
                {this.props.mode === 'edit' ? fields(row, rowindex) : displayModeValues(row, rowindex)}
                <div className={styles.repeater_field_body_row_field + ' ' + this.getFieldCount()}>
                    {this.props.mode === 'edit'
                    ?
                    <a className={styles.repeater_field_body_row_remove} onClick={(e) => this.handleRemoveClick(rowindex, e)} >Remove</a>
                    :
                    <></>}
                </div>
            </div>
        );

        return (

            <div className={'fsrepeatercontainer ' + styles.repeater_field_container} >
                {this.state.schema.rows.length > 0 ?
                <div>
                    <div className={'fsrepeaterheader ' + styles.repeater_field_header} >
                        <div className={styles.repeater_field_title}><span>{this.props.title}</span></div>
                    </div>
                    <div className={'fsrepeaterbody ' + styles.repeater_field_body}>
                        <div className={styles.repeater_field_body_rows} id={this.props.field + '_repeateritems'}>
                            {labels}
                            {rows}
                        </div>                
                    </div>   
                    <div>
                        <a id="addbutton" onClick={this.handleAddClick}>Add {this.props.title} Row</a>
                    </div> 
                </div>
                :
                <div>Add at least one row.</div>
                }
                <div><input type="hidden" data-field={this.props.field} data-type='repeater' value={this.state.json}></input></div>          
            </div>

        );
    }
}

export default RepeaterField;