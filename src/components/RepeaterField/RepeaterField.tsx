import * as React from 'react';
import { useState } from 'react';
import { IRepeaterFieldSchema, IRepeaterRow, IRepeaterColumn, RepeaterControlType } from '../Types';
import styles from './RepeaterField.module.scss';

function RepeaterField(props) {

    const [json, setJson] = useState(JSON.parse(props.value));
    const [value, setValue] = useState(props.value);

    const handleAddClick = (event) => {
        
        let newjson = json;

        if (props.schema.rows.length > 0)
        {
            
            if (props.schema.rows.length > 0) {
                let row: IRepeaterRow = {columns: []};

                props.schema.rows[0].columns.forEach((column) => {
                    
                    const newcolumn: IRepeaterColumn = {label: column.label, control: column.control, defaultvalue: column.defaultvalue, value: ''};
                    row.columns.push(newcolumn);
    
                });
    
                newjson.rows.push(row);
    
                setJson(newjson);
                setValue(JSON.stringify(newjson));
            }

        }
    }

    const handleRemoveClick = (index: number, event) => {

        if (json.rows.length > 0) {
            let newjson = json;

            newjson.rows.splice(index, 1);
     
            setJson(newjson);
            setValue(JSON.stringify(newjson));
        }

    }

    const handleInputChange = (rowindex: number, columnindex: number, event) => {
        if (event.target !== null) {
            if (event.target.value != null) {
                const val = event.target.value;
                let newjson = json;

                newjson.rows[rowindex].columns[columnindex].value = val;;

                setJson(newjson);
                setValue(JSON.stringify(newjson));
            }
        }
    }

    const getFieldCount = (): string => {
        if (props.schema.rows.length > 0) {
            const totalcolumns = props.schema.rows[0].columns.length;
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

    let columns: JSX.Element[] = [];
        

    if (props.schema.rows.length > 0) {
        columns = props.schema.rows[0].columns.map((field: IRepeaterColumn, i: number) =>
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
        column.control === RepeaterControlType.text ? <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}><input type='text' value={row.columns[columnindex].value} onChange={(e) => handleInputChange(rowindex, columnindex, e)}></input></div> :
        column.control === RepeaterControlType.multiline ? <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}><textarea value={row.columns[columnindex].value} onChange={(e) =>handleInputChange(rowindex, columnindex, e)}></textarea></div> : 
        column.control === RepeaterControlType.choice ? <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}><select value={row.columns[columnindex].value} onChange={(e) => handleInputChange(rowindex, columnindex, e)}>{selectoptions(column.defaultvalue)}</select></div> :
        column.control === RepeaterControlType.number ? <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}><input type='number' value={row.columns[columnindex].value} onChange={(e) => handleInputChange(rowindex, columnindex, e)}></input></div> :
        column.control === RepeaterControlType.currency ? <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}><input type='number' min="1" step="any" value={row.columns[columnindex].value} onChange={(e) => handleInputChange(rowindex, columnindex, e)}></input></div> :
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
        {props.schema.rows.length > 0 ?
        props.schema.rows[0].columns.map((column) =>
        <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}>{column.label}</div>
    ) : <div></div>}
    </div>;
    

    const rows = json.rows.map((row: IRepeaterRow, rowindex: number) =>
        <div className={'fsrepeaterrow ' + styles.repeater_field_body_row}>
            {props.mode === 'edit' ? fields(row, rowindex) : displayModeValues(row, rowindex)}
            <div className={styles.repeater_field_body_row_field + ' ' + getFieldCount()}>
                {props.mode === 'edit'
                ?
                <a className={styles.repeater_field_body_row_remove} onClick={(e) => handleRemoveClick(rowindex, e)} >Remove</a>
                :
                <></>}
            </div>
        </div>
    );

    return (
        <div className={'fsrepeatercontainer ' + styles.repeater_field_container} >
        {props.schema.rows.length > 0 ?
        <div>
            <div className={'fsrepeaterheader ' + styles.repeater_field_header} >
                <div className={styles.repeater_field_title}><span>{props.title}</span></div>
            </div>
            <div className={'fsrepeaterbody ' + styles.repeater_field_body}>
                <div className={styles.repeater_field_body_rows} id={props.field + '_repeateritems'}>
                    {labels}
                    {rows}
                </div>                
            </div>   
            <div>
                <a id="addbutton" onClick={handleAddClick}>Add {props.title} Row</a>
            </div> 
        </div>
        :
        <div>Add at least one row.</div>
        }
        <div><input type="hidden" data-field={props.field} data-type='repeater' value={value}></input></div>          
        </div>
    );
}

export default RepeaterField;