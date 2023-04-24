import { ActionType } from "../action-types";
import axios from "axios";
import {
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  Direction,
  Action,
} from "../actions";

import { Cell, CellTypes } from "../cell";
import bundle from "../../bundler";
import { Dispatch } from "redux";
import { RootState } from "../reducers";
export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId: cellId,
      },
    });
    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPELTE,
      payload: {
        bundle: result,
        cellId: cellId,
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.FETCH_CELLS,
    });
    try {
      //data we get back is arry of cell object so annotate with it
      const { data }: { data: Cell[] } = await axios.get("/cells");
      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: error.message,
      });
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const order = getState().cells?.order;

    //based on order get cell data [{},{}]
    const cells = order?.map((id) => getState().cells?.data[id]);

    try {
      await axios.post("/cells", { cells: cells });
    } catch (error: any) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: error.message,
      });
    }
  };
};
