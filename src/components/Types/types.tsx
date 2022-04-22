export interface IFiles {
    value: IFile[];
}

export interface IFile {
    Name: string;
    ServerRelativeUrl: string;
}

export interface IRepeaterFieldSchema {
    rows: IRepeaterRow[]
}

export interface IRepeaterRow {
    columns: IRepeaterColumn[]
}

export interface IRepeaterColumn {
    label: string,
    control: RepeaterControlType, 
    value: string,
    defaultvalue: string[]
}

export interface IChoiceFieldValue {
    value: IChoices[];
}

export interface IChoices {
    Choices: string[];
}

export interface IUsers {
    value: IUser[];
}

export interface IUser {
    Id: number;
    Title: string;
    Email: string;
}

export enum RepeaterControlType {
    text = 1,
    number,
    currency,
    choice,
    multiline
}