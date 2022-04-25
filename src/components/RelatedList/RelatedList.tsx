import * as React from 'react';
import { useState } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './RelatedList.module.scss';

export interface IRelatedListSchema {
    columns: IRelatedListColumn[]
}

export interface IRelatedListColumn {
    label: string,
    field: string
}

export function RelatedList(props) {

    const [rows, setRows] = useState([]);
    const [initiated, setInitiated] = useState(false);

    const listPath: string = `/_api/web/lists/GetByTitle('` + props.relatedlist + `')`;

    const getFieldCount = (): string => {
        if (props.schema.columns.length > 0) {
            const totalcolumns = props.schema.columns.length;
            switch (totalcolumns) {
                case 1:
                    return styles.relatedist_col_one;
                case 2:
                    return styles.relatedist_col_two;
                case 3:
                    return styles.relatedist_col_three;   
                case 4:
                    return styles.relatedist_col_four;  
                case 5:
                    return styles.relatedist_col_five;                   
                default:
                    return '';
            }
        }
        else
        return '';
    }

    const getItem = (id: string): void => {
        if (!initiated) {
            setInitiated(true);
        
            props.webpartcontext.spHttpClient.get(props.webpartcontext.pageContext.web.absoluteUrl + listPath + `/items?$filter=` + props.field + `Id eq ` + props.itemid, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                response.json().then((data) => {
                    
                    const tmprows = data.value.map((row) => 
                        props.schema.columns.map((column) => 
                            <div className={styles.relatedist_col + ' ' + getFieldCount()}>{row[column.field]}</div>)
                        )

                    setRows(tmprows);

                });
            });
        }
    }


    const labels = props.schema.columns.map((column) => 
        <div className={'fsrelatedlistlabel ' + styles.relatedist_col + ' ' + getFieldCount()}>{column.label}</div>
    )

    if (props.itemid !== undefined) {
        if (props.itemid != '0') {
            getItem(props.itemid);
        }
    }

    return (
        <div className={styles.relatedlist_container + ' fsrelatedlistcontainer'}>
            <div className={styles.relatedlist_col_container + ' fsrelatedlistlabelcontainer'}>
                {labels}
            </div>
            <div className={styles.relatedlist_col_container + ' fsrelatedlistrowcontainer'}>
                {rows}
            </div>                
        </div>
    );
}


