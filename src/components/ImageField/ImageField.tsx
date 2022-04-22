import * as React from 'react';
import { BaseField } from '../BaseField/BaseField';
import { IFiles, IFile } from '../Types';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './ImageField.module.scss';


class ImageField extends BaseField {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value !== '' ? this.props.value : this.props.defaultvalue !== undefined ? this.props.defaultvalue : '', files: [],
            fieldinfo: {Required: false, TypeAsString: '', MaxLength: 255, ReadOnlyField: false, Description: ''}
        };
        
        this.uploadFile = this.uploadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getFiles();
    }

    dfgdfg
    public getFiles(): void {
        let spOpts : ISPHttpClientOptions  = {
            headers: {
              "Accept": "application/json;odata.metadata=minimal"
            }      
          };

        this.props.webpartcontext.spHttpClient.fetch(this.props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('` + this.props.library + `')/RootFolder/Files`, SPHttpClient.configurations.v1, spOpts).then((result) => {
            result.json().then((files: IFiles) => {
                this.setState({files: files.value})
            });
        });

    }

    public uploadFile(event): void {
        const input = document.getElementById(event.target.dataset.library.replace(" ", "") + "_fsfile") as HTMLInputElement;

        const file = input.files[0];

        if (file != undefined || file != null) {
          let spOpts : ISPHttpClientOptions  = {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: file        
          };
        
          var url = this.props.webpartcontext.pageContext.web.absoluteUrl + `/_api/Web/Lists/getByTitle('${this.props.library}')/RootFolder/Files/Add(url='${file.name}', overwrite=true)`
        
          this.props.webpartcontext.spHttpClient.post(url, SPHttpClient.configurations.v1, spOpts).then((response: SPHttpClientResponse) => {
        
        
            response.json().then((responseJSON: {ServerRelativeUrl: string}) => {
                console.log(responseJSON.ServerRelativeUrl);
                this.setState({value: this.props.webpartcontext.pageContext.site.absoluteUrl + responseJSON.ServerRelativeUrl});
                this.getFiles();
            });
          });
        
        }

    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        const files = this.state.files.map((file: IFile, i: number) => 
            <option key={i} value={this.props.webpartcontext.pageContext.site.absoluteUrl + file.ServerRelativeUrl}>{file.Name}</option>
        )

        const required = this.state.fieldinfo.Required ? this.state.fieldinfo.Required : false;
        const disabled = this.state.fieldinfo.ReadOnlyField ? this.state.fieldinfo.ReadOnlyField : false;

        return (
            
            this.props.mode === 'edit'
            ?
            <div className={styles.image_field_container}>
                <div className={styles.image_field_left}>
                    <div className={styles.image_field_left_upload}>
                        <div>Upload a new image</div>
                        <div><input type="file" id={this.props.library.replace(" ", "") + "_fsfile"} name={this.props.library.replace(" ", "") + "_fsfile"}  /></div>
                        <div><button type="button" id="uploadbutton" onClick={this.uploadFile} data-library={this.props.library} >Upload</button></div>
                    </div>
                    <div className={styles.image_field_left_select}>
                        <div>Select an existing image</div>
                        <div><select value={this.state.value} onChange={this.handleChange} data-type='image' data-field={this.props.field} size={10}>{files}</select></div>
                    </div>
                </div>
                <div className={styles.image_field_right}>
                <img src={this.state.value}></img>
                </div>
            
            <div></div>
            </div>
            :
            <img src={this.state.value}></img>
        );
    }
}

export default ImageField;