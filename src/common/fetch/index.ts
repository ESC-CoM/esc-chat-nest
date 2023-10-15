import * as path from 'path';

export const fetchClient =
  (baseUrl: string) =>
  ({ path: string }) =>
    fetch(baseUrl + path);
