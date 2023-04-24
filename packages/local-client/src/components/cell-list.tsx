import { useTypeSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import "./cell-list.css";
import { Fragment, useEffect } from "react";
import { useActions } from "../hooks/use-actions";

const CellList: React.FC = () => {
  const cells = useTypeSelector((state) => {
    return state.cells?.order.map((id) => {
      return state.cells?.data[id];
    });
  });
  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderedCells = cells?.map((cell: any) => (
    <Fragment key={cell?.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));
  return (
    <div className="cell-list">
      <AddCell forceVisable={cells?.length === 0} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
