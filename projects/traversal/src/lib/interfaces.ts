import { HttpParams } from '@angular/common/http';
import { HttpParameterCodec } from '@angular/common/http';
import { Type } from '@angular/core';

export interface Target {
  component: any;
  context: {[key: string]: any};
  contextPath: string;
  prefixedContextPath: string;
  path: string;
  prefixedPath: string;
  query?: HttpParams;
  view: string;
}

// Copy from angular/common/http/params until it becomes part of the public api
// https://github.com/angular/angular/pull/20332
export interface HttpParamsOptions {
  /**
   * String representation of the HTTP params in URL-query-string format. Mutually exclusive with
   * `fromObject`.
   */
  fromString?: string;

  /** Object map of the HTTP params. Mutally exclusive with `fromString`. */
  fromObject?: {[param: string]: string | string[]};

  /** Encoding codec used to parse and serialize the params. */
  encoder?: HttpParameterCodec;
}

export interface ViewMapping {
    name: string;
    components: {[target: string]: Type<any>};
}

export type ModuleWithViews = Type<any> & {
    traverserViews: {name: string, components: ViewMapping}[]
};
