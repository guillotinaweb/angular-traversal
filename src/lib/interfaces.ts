export interface Target {
  component: any;
  context: {[key: string]: any};
  contextPath: string;
  path: string;
  query: URLSearchParams;
  view: string;
}
