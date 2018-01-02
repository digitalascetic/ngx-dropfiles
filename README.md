# ngx-dropfiles
ngx-dropfiles is an Angular 5 module for desktop drag’n’drop files

## Install
1. Add `ngx-dropfiles` module as dependency to your project.
```bash
$ npm install ngx-dropfiles --save
```
2. Include `NgxDropfilesModule` into your main AppModule or in module where you will use it.
```
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDropfilesModule } from 'ngx-dropfiles';

@NgModule({
  imports: [
    BrowserModule,
    NgxDropfilesModule
  ],
  declarations: [ AppComponent ],
  exports: [ AppComponent ]
})
export class AppModule {}
```

## Example


```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
      <ngx-dropfiles [dropFilesMessage]="'Drag a file here or browse to upload.'" 
                  [acceptedFiles]="'image/jpg', '.png'"
                  (filesDroppped)="manageFiles($event)"
                  (filesDroppedError)="manageFilesError($event)"></ngx-dropfiles>
  `
})
export class AppHomeComponent {
    
    public manageFiles(files: File[]) {
        console.log(files);
    }
    
    public manageFilesError(files: NgxDropfilesError[]) {
           if(files.length > 0) {
                for(let i = 0; i < files.length; i++){
                    console.log('Error: ' + files[i].errorType + 'for file: ' + files[i].file.name);
                }
           }        
    }
```  