import { IRouteComponentProps } from 'umi'

// only export isBrowser for user
export { isBrowser } from '/Users/guojufeng/Documents/GitHub/xingorg1Blog/node_modules/@umijs/utils/lib/ssr.js';

interface IParams extends Pick<IRouteComponentProps, 'match'> {
  isServer: Boolean;
}

export type IGetInitialProps = (params: IParams) => Promise<any>;
