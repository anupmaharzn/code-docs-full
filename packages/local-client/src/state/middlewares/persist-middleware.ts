import { Dispatch } from "redux";
import { Action } from "../actions";
import { ActionType } from "../action-types";
import { saveCells } from "../action-creators";
import { RootState } from "../reducers";

export const presistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      //pass alone every single action we receive
      next(action);
      //if incomming action type matches these types then
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};
