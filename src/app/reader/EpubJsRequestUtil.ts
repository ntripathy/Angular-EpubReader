import defer from 'epubjs/lib/utils/core';
import * as RSVP from 'rsvp';
export class EpubJsRequestUtil {


    constructor() {
    }

    request(url, type, withCredentials, headers) {
        const supportsURL = (typeof window != 'undefined') ? window.URL : false; // TODO: fallback for url if window isn't defined
        const BLOB_RESPONSE = supportsURL ? 'blob' : 'arraybuffer';

        const deferred = new RSVP.defer();

        const xhr = new XMLHttpRequest();

        //-- Check from PDF.js:
        //   https://github.com/mozilla/pdf.js/blob/master/web/compatibility.js
        const xhrPrototype = XMLHttpRequest.prototype;

        let header;

        if (!('overrideMimeType' in xhrPrototype)) {
            // IE10 might have response, but not overrideMimeType
            Object.defineProperty(xhrPrototype, 'overrideMimeType', {
                value: function xmlHttpRequestOverrideMimeType() {}
            });
        }

        if(withCredentials) {
            xhr.withCredentials = true;
        }

        xhr.onreadystatechange = handler;
        xhr.onerror = err;

        xhr.open('GET', url, true);

        for(header in headers) {
            xhr.setRequestHeader(header, headers[header]);
        }

        if(type == 'json') {
            xhr.setRequestHeader('Accept', 'application/json');
        }

        // If type isn't set, determine it from the file extension
        if(!type) {
            type = url.split('.').pop();
        }

        if(type == 'blob'){
            xhr.responseType = BLOB_RESPONSE as XMLHttpRequestResponseType;;
        }


        if(['xml', 'opf', 'ncx'].indexOf(type) > -1) {
            // xhr.responseType = 'document';
            xhr.overrideMimeType('text/xml'); // for OPF parsing
        }

        if(type == 'xhtml') {
            // xhr.responseType = 'document';
        }

        if(type == 'html' || type == 'htm') {
            // xhr.responseType = 'document';
        }

        if(type == 'binary') {
            xhr.responseType = 'arraybuffer';
        }

        xhr.send();

        function err(e) {
            deferred.reject(e);
        }

        function handler() {
            if (this.readyState === XMLHttpRequest.DONE) {
                let responseXML = false;

                if(this.responseType === '' || this.responseType === 'document') {
                    responseXML = this.responseXML;
                }

                if (this.status === 200 || this.status === 0 || responseXML) { //-- Firefox is reporting 0 for blob urls
                    let r;

                    if (!this.response && !responseXML) {
                        deferred.reject({
                            status: this.status,
                            message : 'Empty Response',
                            stack : new Error().stack
                        });
                        return deferred.promise;
                    }

                    if (this.status === 403) {
                        deferred.reject({
                            status: this.status,
                            response: this.response,
                            message : 'Forbidden',
                            stack : new Error().stack
                        });
                        return deferred.promise;
                    }
            
                    if(responseXML){
                        r = this.responseXML;
                    } else
                    if(['xml', 'opf', 'ncx'].indexOf(type) > -1){
                        // xhr.overrideMimeType('text/xml'); // for OPF parsing
                        // If this.responseXML wasn't set, try to parse using a DOMParser from text
                        // r = parse(this._response, 'text/xml', false);
                        r = new DOMParser().parseFromString(this._response, 'application/xml');
                    }else
                    if(type == 'xhtml'){
                        // r = parse(this._response, 'application/xhtml+xml', false);
                        r = new DOMParser().parseFromString(this._response, 'application/xhtml+xml');
                    }else
                    if(type == 'html' || type == 'htm'){
                        // r = parse(this._response, 'text/html', false);
                        r = new DOMParser().parseFromString(this._response, 'text/html');
                    }else
                    if(type == 'json'){
                        r = JSON.parse(this._response);
                    }else
                    if(type == 'blob'){

                        if(supportsURL) {
                            r = this._response;
                        } else {
                            //-- Safari doesn't support responseType blob, so create a blob from arraybuffer
                            r = new Blob([this._response]);
                        }

                    } else{
                        r = this._response;
                    }

                    deferred.resolve(r);
                } else {

                    deferred.reject({
                        status: this.status,
                        message : this.response,
                        stack : new Error().stack
                    });

                }
            }
        }

        return deferred.promise;
    }
}
