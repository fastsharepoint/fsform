import * as React from 'react';
import { useState } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './FSForm.module.scss';

interface EnrichedChildren {
    children?: React.ReactNode
    webpartcontext: WebPartContext
    value: string
    mode: string
    list: string
  }

  function FSForm(props) {
  
    const enrichRadioElements = (children: React.ReactNode, webpartcontext: WebPartContext, item: any, value: string = '', mode: string = props.mode, list: string = props.list, id: string = parseInt(props.id) > parseInt(stateid) ? props.id : stateid): any =>
    {
       return React.Children.map(children, child => {

           if (!React.isValidElement<EnrichedChildren>(child)) {
             return child
           }

           let elementChild: React.ReactElement<EnrichedChildren> = child;
         
           const elementInfo: any = child.props.children;

           const getValue = () => {
            let fieldname = '';
            try {
              fieldname = elementInfo.props.field;
            }
            catch {}
  
            let fieldvalue = '';
            if (fieldname !== "") {

              if (elementInfo.type.name === 'ImageField') {
                try {
                  fieldvalue = item[fieldname].Url
                }
                catch {}
              }
              else {
                fieldvalue = item[fieldname];
              }
            }

            return fieldvalue + '';
           }

           if (child.props.children) {
      
             child = React.cloneElement<EnrichedChildren>(elementChild, {
               children: enrichRadioElements(elementChild.props.children, webpartcontext, item, getValue(), mode, list, id),
             })
           }
           

           return React.cloneElement(child as React.ReactElement<any>, {
              webpartcontext: webpartcontext,
              value: value,
              mode: mode,
              list: list,
              itemid: id
            })
      
         })
    }

    const [elements, setElements] = useState();
    const [stateid, setId] = useState(props.id);
    const [initiated, setInitiated] = useState(false);

    const listPath: string = `/_api/web/lists/GetByTitle('` + props.list + `')`;

    const webpartcontext = props.webpartcontext;

    const getItem = (id: string): Promise<any> => {
      return webpartcontext.spHttpClient.get(webpartcontext.pageContext.web.absoluteUrl + listPath + `/items(${id})`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        });
    }

    if (!initiated) {
      setInitiated(true);
      getItem(props.id).then((results) => {
        setElements(enrichRadioElements(props.children, props.webpartcontext, results));
      })
    }

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        saveItem(stateid);

        if (props.onsave)
          props.onsave(stateid);
    }

    const handleClose = (event) => {
      if (props.onclose)
        props.onclose();
    }

    const saveItem = (id: string) => {

        let bodytmp = {}

        const formFields = document.querySelectorAll('[data-field]');
        formFields.forEach((element) => {
            const inputElement =  element as HTMLInputElement;
            if (inputElement.dataset.field !== '') {
              if (inputElement.dataset.type === 'image') {
                bodytmp[inputElement.dataset.field] = {Description: inputElement.value, Url: inputElement.value}
              }
              else {
                bodytmp[inputElement.dataset.field] = inputElement.value
              }
            }
                
        })

        const body = JSON.stringify(bodytmp);


      webpartcontext.spHttpClient.post(webpartcontext.pageContext.web.absoluteUrl + listPath + `/items` + (id != '0' ? `(` + id + `)` : ``), SPHttpClient.configurations.v1, 
      {
        headers: {
        'Accept': 'application/json;odata.metadata=minimal',
        'IF-MATCH': '*',
        'X-HTTP-Method': id != '0' ? 'PATCH' : 'POST'
        },
        body: body
        }
      )          
      .then((response: SPHttpClientResponse) => {

        if (response.status > 299)
          return response.json().then((reason) => {console.log(reason)});
        else {

          if (id != '0') {
            console.log('form submitted successfully')
          }
          else {
            response.json().then((data) => {
              setId(data.ID)
            });
          }
          
        }
      }).catch(reason => {
        console.log(reason);
      } );
    }

      return (
        <form onSubmit={submitForm}>
        {elements}
        {props.mode === 'edit' ?
        <div className={styles.button_container}><button type='submit'>Save</button><button type='button' onClick={handleClose}>Close</button></div>
        :
        <div className={styles.button_container}><button type='button' onClick={handleClose}>Close</button></div>
        }
        </form>
      );
  }
  
  export default FSForm;

