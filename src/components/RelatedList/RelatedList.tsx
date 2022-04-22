import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './RelatedList.module.scss';

type RelListState = {
    rows: JSX.Element[];
};

type RelListProps = {
    webpartcontext?: WebPartContext;
    relatedlist: string;
    title: string;
    field: string;
    itemid?: string;
    schema: IRelatedListSchema;
};

export interface IRelatedListSchema {
    columns: IRelatedListColumn[]
}

export interface IRelatedListColumn {
    label: string,
    field: string
}

export class RelatedList extends React.Component<RelListProps, RelListState>  {
    constructor(props) {
        super(props);
      
        this.state = {rows: []};

        if (this.props.itemid !== undefined) {
            if (this.props.itemid != '0') {
                this.getItem(this.props.itemid);
            }
        }
    }
    
    listPath: string = `/_api/web/lists/GetByTitle('` + this.props.relatedlist + `')`;

    public getItem(id: string): void {
        this.props.webpartcontext.spHttpClient.get(this.props.webpartcontext.pageContext.web.absoluteUrl + this.listPath + `/items?$filter=` + this.props.field + `Id eq ` + this.props.itemid, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
            response.json().then((data) => {
                
                this.setState({rows: data.value.map((row) => 
                    this.props.schema.columns.map((column) => 
                        <div className={styles.relatedist_col + ' ' + this.getFieldCount()}>{row[column.field]}</div>)
                )})
            });
          });
    }

    getFieldCount(): string {
        if (this.props.schema.columns.length > 0) {
            const totalcolumns = this.props.schema.columns.length;
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

    render() {
        //const required = this.state.fieldinfo.Required ? this.state.fieldinfo.Required : false;
        //const disabled = this.state.fieldinfo.ReadOnlyField ? this.state.fieldinfo.ReadOnlyField : false;
        const labels = this.props.schema.columns.map((column) => 
            <div className={'fsrelatedlistlabel ' + styles.relatedist_col + ' ' + this.getFieldCount()}>{column.label}</div>
        )
        return (
            <div className={styles.relatedlist_container + ' fsrelatedlistcontainer'}>
                <div className={styles.relatedlist_col_container + ' fsrelatedlistlabelcontainer'}>
                    {labels}
                </div>
                <div className={styles.relatedlist_col_container + ' fsrelatedlistrowcontainer'}>
                    {this.state.rows}
                </div>                
            </div>

            );
    }
}

