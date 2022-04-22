import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import styles from './FSForm.module.scss';

type MyProps = {
    //children: JSX.Element;
    webpartcontext: WebPartContext;
    list: string;
    id: string;
    mode: string;
    returnurl: string;
    submitmessage?: string;
};

type MyState = {
    elements: any;
    id: string;
};

interface EnrichedChildren {
    //onChange(): void
    //selectedValue: string
    children?: React.ReactNode
    webpartcontext: WebPartContext
    value: string
    mode: string
    list: string
  }





class FSForm extends React.Component<MyProps, MyState> {
    constructor(props) {
        super(props);

        this.setState({elements: this.enrichRadioElements(this.props.children, this.props.webpartcontext, ''), id: this.props.id !== '' ? this.props.id : '0'});
    
        const item = this.getItem(this.props.id).then((results) => {
            this.setState({elements: this.enrichRadioElements(this.props.children, this.props.webpartcontext, results)});
        })

        this.handleClose = this.handleClose.bind(this);
    }

    enrichRadioElements = (children: React.ReactNode, webpartcontext: WebPartContext, item: any, value: string = '', mode: string = this.props.mode, list: string = this.props.list, id: string = parseInt(this.props.id) > parseInt(this.state.id) ? this.props.id : this.state.id): any =>
    {
       return React.Children.map(children, child => {

           if (!React.isValidElement<EnrichedChildren>(child)) {
             return child
           }

      
           //const elementChildInfo: {props: {field} = child.props;
           //console.log(elementChildInfo.children.type.name);
           let elementChild: React.ReactElement<EnrichedChildren> = child;
         
           const elementInfo: any = child.props.children;
           //if (elementInfo.type.name === "TextField")

           //console.log(elementInfo);


           const getValue = () => {
            let fieldname = '';
            try {
              fieldname = elementInfo.props.field;
            }
            catch {}
  
            let fieldvalue = '';
            if (fieldname !== "") {
              //console.log(this.props.id);
              if (elementInfo.type.name === 'ImageField') {
                //fieldvalue = item[fieldname].Url
                try {
                  fieldvalue = item[fieldname].Url
                }
                catch {}
              }
              else {
                fieldvalue = item[fieldname];
              }
                
                //console.log(item[fieldname]);
            }

            return fieldvalue + '';
           }

           if (child.props.children) {
      
             child = React.cloneElement<EnrichedChildren>(elementChild, {
               children: this.enrichRadioElements(elementChild.props.children, webpartcontext, item, getValue(), mode, list, id),
             })
           }
           

           return React.cloneElement(child as React.ReactElement<any>, {
              //onChange: () => {},
              //selectedValue: 'value'
              webpartcontext: webpartcontext,
              value: value,
              mode: mode,
              list: list,
              itemid: id
            })
      
           //console.log(child.props.type);
           //if (elementChildInfo.children.type.name === 'SelectChoiceField') {
             //const selectedchoiceprops: SelectedChoiceProps = elementChildInfo.children.props;
             //console.log(selectedchoiceprops.list);
             //return React.cloneElement(elementChild, {
             //  //onChange: () => {},
             //  //selectedValue: 'value'
             //  webpartcontext: this.webpartcontext
             //})
           //} else {
           //  return elementChild
           //}
         })
    }

    state: MyState = {
        elements: [],
        id: '0'
    };

    private listPath: string = `/_api/web/lists/GetByTitle('` + this.props.list + `')`;

    webpartcontext = this.props.webpartcontext;

    public getItem(id: string): Promise<any> {
        return this.webpartcontext.spHttpClient.get(this.webpartcontext.pageContext.web.absoluteUrl + this.listPath + `/items(${id})`, SPHttpClient.configurations.v1)
          .then((response: SPHttpClientResponse) => {
            return response.json();
          });
    }

    submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();
    
        this.saveItem(this.state.id);
        // Do something 
        //alert(term);
    }

    handleClose = (event) => {
      window.location.href=this.props.returnurl;
    }

    public saveItem(id: string) {

        let bodytmp = {}

        const formFields = document.querySelectorAll('[data-field]');
        formFields.forEach((element) => {
            const inputElement =  element as HTMLInputElement;
            //console.log(inputElement.dataset.field)
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


      this.webpartcontext.spHttpClient.post(this.webpartcontext.pageContext.web.absoluteUrl + this.listPath + `/items` + (id != '0' ? `(` + id + `)` : ``), SPHttpClient.configurations.v1, 
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

          alert(this.props.submitmessage ? this.props.submitmessage : 'Saved');

          if (id != '0') {
            console.log('form submitted successfully')
          }
          else {
            response.json().then((data) => {
              this.setState({id: data.ID})
            });
          }
          
        }
      }).catch(reason => {
        console.log(reason);
      } );
    }




    render() {

        return (
 

            <form onSubmit={this.submitForm}>
                {this.state.elements}
                {this.props.mode === 'edit' ?
                <div className={styles.button_container}><button type='submit'>Save</button><button type='button' onClick={this.handleClose}>Close</button></div>
                :
                <div className={styles.button_container}><button type='button' onClick={this.handleClose}>Close</button></div>
                }
            </form>
        );
    }

}

export default FSForm