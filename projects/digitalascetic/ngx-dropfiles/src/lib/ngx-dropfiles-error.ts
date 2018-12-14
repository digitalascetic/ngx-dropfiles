export enum NgxDropfilesErrorType {
    MIME_TYPE_ERROR
}

export class NgxDropfilesError {
    private _errorType: NgxDropfilesErrorType;
    private _file: File;

    constructor(type: NgxDropfilesErrorType, file: File) {
        this._errorType = type;
        this._file = file;
    }

    get errorType(): NgxDropfilesErrorType {
        return this._errorType;
    }

    get file(): File {
        return this._file;
    }
}
