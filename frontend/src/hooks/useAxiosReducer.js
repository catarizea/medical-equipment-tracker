import { useReducer, useMemo, useCallback, useRef } from 'react';
import get from 'lodash.get';

import createAxiosClient from '../utils/createAxiosClient';

const createAsyncTypes = (type) => [
  { type: `${type}_REQUEST` },
  { type: `${type}_SUCCESS` },
  { type: `${type}_FAILURE` },
];

export default (reducer, initialState, hasLogger = false) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const preState = useRef();

  const saveAction = useCallback((action) => {
    const actionType = typeof action === 'object' ? action.type : dispatch;

    preState.current.actions = preState.current.actions || [];
    preState.current.actions.push({
      actionType,
      action,
      state: preState.current.state,
    });
  }, []);

  const dispatchWithLogging = useCallback(
    async (action) => {
      const url = get(action, 'payload.request.url', null);
      const method = get(action, 'payload.request.method', null);
      const body = get(action, 'payload.request.body', {});

      if (!url || !method) {
        saveAction(action);
        dispatch(action);
      } else {
        const asyncActions = createAsyncTypes(action.type);

        try {
          saveAction(asyncActions[0]);
          dispatch(asyncActions[0]);

          const request = {
            method,
            url,
            withCredentials: true,
          };

          if (Object.keys(body).length) {
            request.data = body;
          }

          const axios = await createAxiosClient(dispatchWithLogging, preState.current.state);
          const res = await axios(request);

          const successAction = { ...asyncActions[1], data: res.data };

          saveAction(successAction);
          dispatch(successAction);
        } catch (error) {
          const failureAction = { ...asyncActions[2], error };

          saveAction(failureAction);
          dispatch(failureAction);
        }
      }
    },
    [saveAction],
  );

  useMemo(() => {
    if (!hasLogger || !preState.current) return;

    for (let i = 0; i < preState.current.actions.length; i++) {
      const {
        actionType,
        state: previousState,
        action,
      } = preState.current.actions[i];

      console.group(`${actionType}`);
      console.log('%c Previous State', 'color: red;', previousState);
      console.log('%c Action', 'color: blue;', action);
      console.log('%c Current State', 'color: green;', state);
      console.groupEnd();

      preState.current.actions = [];
    }
  }, [state, hasLogger]);

  preState.current = { ...preState.current, state };

  return [state, dispatchWithLogging];
};
