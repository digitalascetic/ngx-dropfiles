export default {
    input: 'tmp/esm5/ngx-dropfiles.js',
    output: {
        file: 'dist/bundles/ngx-dropfiles.umd.js',
        format: 'umd'
    },
    name: 'ng.ngx-dropfiles',
    external: ['@angular/core'],
    globals: {
        '@angular/core': 'ng.core'
    }
}
