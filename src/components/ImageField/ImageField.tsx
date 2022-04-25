import * as React from 'react';
import { useState, useEffect } from 'react';
import { IFiles, IFile } from '../Types';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './ImageField.module.scss';

function ImageField(props) {

    const [value, setValue] = useState(props.value !== '' ? props.value : props.defaultvalue !== undefined ? props.defaultvalue : '');
    const [tmpfiles, setFiles] = useState([]);
    const [initiated, setInitiated] = useState(false);

    const getFiles = (): void => {
        let spOpts : ISPHttpClientOptions  = {
            headers: {
              "Accept": "application/json;odata.metadata=minimal"
            }      
          };

          if (!initiated)
          {
            setInitiated(true);
            props.webpartcontext.spHttpClient.fetch(props.webpartcontext.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('` + props.library + `')/RootFolder/Files`, SPHttpClient.configurations.v1, spOpts).then((result) => {
                result.json().then((files: IFiles) => {
                    setFiles(files.value);
                });
            });
          }


    }

    const uploadFile = (event): void => {
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
        
          var url = props.webpartcontext.pageContext.web.absoluteUrl + `/_api/Web/Lists/getByTitle('${props.library}')/RootFolder/Files/Add(url='${file.name}', overwrite=true)`
        
          props.webpartcontext.spHttpClient.post(url, SPHttpClient.configurations.v1, spOpts).then((response: SPHttpClientResponse) => {
        
        
            response.json().then((responseJSON: {ServerRelativeUrl: string}) => {
                console.log(responseJSON.ServerRelativeUrl);
                setValue(props.webpartcontext.pageContext.site.absoluteUrl + responseJSON.ServerRelativeUrl);
                setInitiated(false);
                getFiles();
            });
          });
        
        }

    }

    const files = tmpfiles.map((file: IFile, i: number) => 
        <option key={i} value={props.webpartcontext.pageContext.site.absoluteUrl + file.ServerRelativeUrl}>{file.Name}</option>
    )


    useEffect(() => {
        getFiles();
    });
    
    return (
        props.mode === 'edit'
        ?
        <div className={styles.image_field_container}>
            <div className={styles.image_field_left}>
                <div className={styles.image_field_left_upload}>
                    <div>Upload a new image</div>
                    <div><input type="file" id={props.library.replace(" ", "") + "_fsfile"} name={props.library.replace(" ", "") + "_fsfile"}  /></div>
                    <div><button type="button" id="uploadbutton" onClick={uploadFile} data-library={props.library} >Upload</button></div>
                </div>
                <div className={styles.image_field_left_select}>
                    <div>Select an existing image</div>
                    <div><select value={value} onChange={(e) => setValue(e.target.value)} data-type='image' data-field={props.field} size={10}>{files}</select></div>
                </div>
            </div>
            <div className={styles.image_field_right}>
            <img src={value}></img>
            </div>
        
        <div></div>
        </div>
        :
        <img src={value}></img>
    );
}

export default ImageField;