import React from 'react';
import {inject, observer} from 'mobx-react';
import {getEnv} from 'mobx-state-tree';
import {IMainStore} from '../store';
import qs from 'qs';
import {render as amisRender, utils, filter} from 'amis';
import { withRouter } from 'react-router-dom'
import { useMemo } from 'react';

let env: any;

export function schema2component(
  schema: any,
  transform?: Function,
  // session: string = 'page'
) {
  interface SchemaRendererProps {
    store: IMainStore;
    history: any;
    [propName: string]: any;
  }

  const SchemaRenderer: React.FC<SchemaRendererProps> = (props) => {
    console.log(props, 'prosp')
      const displayName = 'SchemaRenderer';
      const location = props.history.location;
  
      function thisGetEnv() {
        if (env) {
          return env;
        }
  
        const store = props.store;
        const rootEnv = getEnv(store);
  
        console.log(rootEnv, 'rootEnv')
  
        const normalizeLink = (to: string, preserveHash?: boolean) => {
          if (/^\/api\//.test(to)) {
            return to;
          }
  
          to = to || '';
          const history = props.history;
  
          const currentQuery = qs.parse(location.search.substring(1));
          to = filter(
            to.replace(/\$\$/g, qs.stringify(currentQuery)),
            currentQuery
          );
  
          if (to && to[0] === '#') {
            to = location?.pathname + location.search + to;
          } else if (to && to[0] === '?') {
            to = location?.pathname + to;
          }
  
          const idx = to.indexOf('?');
          const idx2 = to.indexOf('#');
          let pathname = ~idx
            ? to.substring(0, idx)
            : ~idx2
            ? to.substring(0, idx2)
            : to;
          let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
          let hash = ~idx2
            ? to.substring(idx2)
            : preserveHash
            ? location.hash
            : '';
  
          if (!pathname) {
            pathname = location.pathname;
          } else if (pathname[0] != '/' && !/^\w+\:/.test(pathname)) {
            let relativeBase = location.pathname;
            const paths = relativeBase.split('/');
            paths.pop();
            let m;
            while ((m = /^\.\.?\//.exec(pathname))) {
              if (m[0] === '../') {
                paths.pop();
              }
              pathname = pathname.substring(m[0].length);
            }
            pathname = paths.concat(pathname).join('/');
          }
  
          return pathname + search + hash;
        };
  
        const isCurrentUrl = (to: string) => {
          const link = normalizeLink(to);
          let pathname = link;
          let search = '';
          const idx = link.indexOf('?');
          if (~idx) {
            pathname = link.substring(0, idx);
            search = link.substring(idx);
          }
  
          if (search) {
            if (pathname !== location.pathname || !location.search) {
              return false;
            }
            const currentQuery = qs.parse(location.search.substring(1));
            const query = qs.parse(search.substring(1));
  
            return Object.keys(query).every(
              key => query[key] === currentQuery[key]
            );
          } else if (pathname === location.pathname) {
            return true;
          }
  
          return false;
        };
  
        return (env = {
          ...rootEnv,
          session: 'page',
          isCurrentUrl,
          updateLocation:
            props.updateLocation ||
            ((location: string, replace: boolean) => {
              const history = props.history;
              if (location === 'goBack') {
                return history.goBack();
              } else if (/^https?\:\/\//.test(location)) {
                return (window.location.href = location);
              }
  
              history[replace ? 'replace' : 'push'](
                normalizeLink(location, replace)
              );
            }),
          jumpTo:
            props.jumpTo ||
            ((to: string, action?: any) => {
              const history = props.history;
              if (to === 'goBack') {
                return history.goBack();
              }
  
              to = normalizeLink(to);
  
              if (isCurrentUrl(to)) {
                return;
              }
  
              if (action && action.actionType === 'url') {
                action.blank === false
                  ? (window.location.href = to)
                  : window.open(to, '_blank');
                return;
              } else if (action && action.blank) {
                window.open(to, '_blank');
                return;
              }
  
              if (/^https?:\/\//.test(to)) {
                window.location.href = to;
              } else {
                history.push(to);
              }
            }),
          affixOffsetTop: props.embedMode ? 0 : 50
        });
      }
  
      console.log(props, 'props');
  
      const {
        router,
        match,
        history,
        store,
        schema,
        jumpTo,
        updateLocation,
        embedMode,
        ...rest
      } = props;
      let finalSchema =  schema;
  
  
      if (!finalSchema.type) {
        finalSchema = {...finalSchema, type: 'page'};
      }
  
      console.log(JSON.stringify(finalSchema), 'schema')
      // const body = useMemo(() => console.log('woaini') && amisRender(
      //   finalSchema,
      //   {
      //     data: utils.createObject({
      //       ...match?.params,
      //       amisStore: store,
      //       pathname: location.pathname,
      //       params: match?.params
      //     }),
      //     ...rest,
      //     fetcher: store.fetcher,
      //     notify: store.notify,
      //     alert: store.alert,
      //     copy: store.copy,
      //     propsTransform: transform,
      //     theme: store.theme
      //   },
      //   thisGetEnv()
      // ), [finalSchema, location.pathname, match?.params, rest, store, thisGetEnv])

      // const body = 'tss'
        const body = amisRender(
          finalSchema,
          {
            // data: utils.createObject({
            //   ...match?.params,
            //   amisStore: store,
            //   pathname: location.pathname,
            //   params: match?.params
            // }),
            // ...rest,
            // fetcher: store.fetcher,
            // notify: store.notify,
            // alert: store.alert,
            // copy: store.copy,
            // propsTransform: transform,
            // theme: store.theme
          },
          // thisGetEnv()
        );
    
        // console.log(body, 'body')
    
        return <>{body}</>;
      
    }

  const Compo = withRouter(inject('store')(observer(SchemaRenderer)))

  return Compo;
}

export default schema2component({type: 'page', body: 'It works'});
