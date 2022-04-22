import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { IRepeaterFieldSchema, IFile, IUser } from '../Types';

type BaseState = {
    value?: string;
    files?: IFile[];
    schema?: IRepeaterFieldSchema;
    json?: string;
    choices?: string[];
    users?: IUser[];
    fieldinfo?: IFieldInfo;
};

export type BaseProps = {
    field: string;
    value?: string;
    defaultvalue?: string;
    webpartcontext?: WebPartContext;
    mode?: string;
    list?: string;
    library?: string;
    schema?: IRepeaterFieldSchema;
    title?: string;
    itemid?: string;
    classcontainer?: string;
};

interface IFieldInfo {
    Required: boolean; 
    TypeAsString: string;
    MaxLength: number;
    ReadOnlyField: boolean;
    Description: string
}



export class BaseField extends React.Component<BaseProps, BaseState> {
    constructor(props) {
        super(props);
        this.setState({fieldinfo: {Required: false, TypeAsString: '', MaxLength: 255, ReadOnlyField: false, Description: ''}})

        this.getFieldInfo(this.props.list, this.props.field);
        
    }

    public getFieldInfo(list: string, field: string): void {
        this.props.webpartcontext.spHttpClient.get(this.props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('` + list + `')` + `/fields?$filter=EntityPropertyName eq '` + field +`'`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
            response.json().then((data) => {
                if (data.value.length > 0) {
                    console.log(data.value);
                    this.setState({fieldinfo: {Required: data.value[0].Required, TypeAsString: data.value[0].TypeAsString, MaxLength: data.value[0].MaxLength, ReadOnlyField: data.value[0].ReadOnlyField, Description: data.value[0].Description}})
                }
                    
        });
        });
    }

    public getClassContainer(): string {
        return (this.props.classcontainer !== 'undefined' ? ' ' + this.props.classcontainer : '');
    }
}

