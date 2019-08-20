import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NgxDropfilesError, NgxDropfilesErrorType} from './ngx-dropfiles-error';

@Component({
    selector: 'ngx-dropfiles',
    template: `
        <div class="files-drop-wrapper" [ngClass]="{'over': onOver}"
             (click)="openFilesDialog()"
             (drop)="dropFiles($event)"
             (dragover)="handleDragOver($event)"
             (dragleave)="handleDragLeave($event)">
            <div class="files-drop-messages">{{dropFilesMessage}}</div>
            <input #inputFile type="file" [attr.accept]="acceptedFiles" multiple
                   (change)="handleFiles($event)">
        </div>
    `,
    styles: [`
        .files-drop-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px dashed #c0c4c7;
            border-radius: 6px;
            background: #FFFFFF;
            min-height: 150px;
            box-shadow: 1px 2px 20px hsla(0, 0%, 4%, .1);
            margin-bottom: 2em;
            cursor: pointer;
        }

        .files-drop-wrapper .files-drop-messages {
            font-size: 1.2em;
            font-weight: 400;
            text-align: center;
            color: #646C7F;
        }

        .files-drop-wrapper .files-drop-messages label {
            color: #327CCB;
        }

        .files-drop-wrapper.over {
            border-color: #327CCB;
        }

        .files-drop-wrapper input {
            display: none;
        }
    `]
})
export class NgxDropfilesComponent implements OnInit {
    @Input() acceptedFiles: string;
    @Input() dropFilesMessage: string;
    @Output() filesDroppped: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Output() filesDroppedError: EventEmitter<NgxDropfilesError[]> = new EventEmitter<NgxDropfilesError[]>();

    @ViewChild('inputFile', { static: true }) inputFile: ElementRef;

    onOver: boolean = false;

    private filesErrorArray: NgxDropfilesError[] = [];

    ngOnInit() {
        if (!this.dropFilesMessage) {
            this.dropFilesMessage = 'Drag a file here or browse to upload.';
        }
    }

    openFilesDialog() {
        this.inputFile.nativeElement.click();
    }

    handleDragOver(event: any) {
        event.preventDefault();
        this.onOver = true;
    }

    handleDragLeave(event: any) {
        this.onOver = false;
    }

    dropFiles(event: any) {
        event.preventDefault();

        this.onOver = false;
        const dataTransfer = event.dataTransfer;
        if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
            const filesProcessed = this._processFileTypes(dataTransfer.files);
            this._emitFiles(filesProcessed);
        }
    }

    handleFiles(event: any) {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const filesProcessed: File[] = this._processFileTypes(event.target.files);
            this._emitFiles(filesProcessed);
        }
    }

    private _emitFiles(files: File[]) {
        if (files.length > 0) {
            this.filesDroppped.emit(files);
        }
        this._emiteFilesError();
    }

    private _emiteFilesError() {
        if (this.filesErrorArray.length > 0) {
            this.filesDroppedError.emit(this.filesErrorArray);
        }

        // CLEAR ARRAY AFTER EMITED
        this.filesErrorArray = [];
    }

    /**
     * If has acceptedFiles we only return files with accepted mimeType or file extension
     *
     */
    private _processFileTypes(files: File[]): File[] {
        const filesArray = Array.from(files);

        if (this.acceptedFiles) {
            return filesArray.filter(file => this._isValidFileType(file, this.acceptedFiles));
        }

        return filesArray;
    }

    /**
     *  Check if match file with accepted mimeTypes or file extesions,
     *  also we store in array files with incorrect mimeTypes or file extesions
     *
     */
    private _isValidFileType(file: File, acceptedFiles: string): boolean {

        const acceptedFilesArray: string[] = acceptedFiles.split(',');
        const fileMimeType: string = file.type;
        const baseMimeType: string = fileMimeType.replace(/\/.*$/, '');

        let validType: boolean = false;

        acceptedFilesArray.forEach(acceptedType => {

            acceptedType = acceptedType.trim();

            if (acceptedType.charAt(0) === '.') {
                // File extension like .png
                if (file.name.toLowerCase().indexOf(acceptedType.toLowerCase(), file.name.length - acceptedType.length) !== -1) {
                    validType = true;
                }
            } else if (/\/\*$/.test(acceptedType)) {
                // Something like image/* mime errorType
                if (baseMimeType === acceptedType.replace(/\/.*$/, '')) {
                    validType = true;
                }
            } else {
                // Something like image/png mime errorType
                if (fileMimeType === acceptedType) {
                    validType = true;
                }
            }
        });

        if (!validType) {
            this.filesErrorArray.push(new NgxDropfilesError(NgxDropfilesErrorType.MIME_TYPE_ERROR, file));
        }

        return validType;
    }
}
