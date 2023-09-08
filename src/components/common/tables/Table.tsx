import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { ButtonGroup } from 'react-bootstrap';
import BoostrapTable from 'react-bootstrap/Table';

import { Shimmer } from '../shimmer';

import './table.css';
import { Link } from 'react-router-dom';
import { MaterialIcon } from '../icons/MaterialIcon';

interface ButtonType {
  icon: string;
  color: string;
}

interface TableButtonProps {
  item: {
    id?: number;
    [key: string]: any;
  };
  buttonType: ButtonType;
  onPress: ((item: object) => void) | string;
}

interface TablePaginationProps {
  itemPerPage: number;
  onChangeItemPerPage?: (_: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  page: number;
  canNext: boolean
}

type stateCallback = (_: string[]) => string[];

interface TableProps {
  isLoading?: boolean;
  keys: TableKeyProps[];
  onDeleteItem?: (_: any) => void;
  onEditItem?: string | ((_: any) => void);
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onSelectedRow?: React.Dispatch<React.SetStateAction<string[]>>
  | ((_: stateCallback | string[]) => void);
  onViewItem?: string | (() => void);
  page?: number;
  selectedRows?: string[],
  showPagination?: boolean;
  values: TableItemProps[];
  itemPerPage?: number;
  canNext?: boolean;
  onChangeItemPerPage?: (_: number) => void;
}

export interface TableItemProps {
  [key: string]: any;
  style?: React.CSSProperties;
}

export interface TableKeyProps {
  class?: string;
  style?: React.CSSProperties;
  key?: string;
  value: string;
}

const styles = {
  action: {
    width: '150px',
  }
};

const BUTTON_TYPE = {
  delete: { icon: 'delete_forever', color: 'outline-danger' },
  edit: { icon: 'edit', color: 'outline-primary' },
  view: { icon: 'visibility', color: 'outline-primary' },
};

const TableButton: React.FC<TableButtonProps> = ({ item, buttonType, onPress }) => {
  const href = typeof onPress === 'string' ? `${onPress}/${item.id || item.Id}` : '';

  function handleOnPres(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (typeof onPress === 'function') {
      event.preventDefault();

      onPress(item);
    }
  }

  return (
    <Link
      className={`btn btn-${buttonType.color} d-flex align-self-center`}
      to={href}
      onClick={handleOnPres}
    >
      <i className="material-icons">{buttonType.icon}</i>
    </Link>
  );
};

const TablePagination: React.FC<TablePaginationProps> = ({
  canNext = false,
  itemPerPage = 20,
  onChangeItemPerPage,
  onNext,
  onPrev,
  page = 1,
}) => {
  const handeOnChangeItemPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { target } = event;

    onChangeItemPerPage && onChangeItemPerPage(parseInt(target.value));
  };

  return (
    <div className="table-pagination-div">
      <div className="d-flex align-items-center">
        <span className="m-r-8">Elementos por página:</span>

        <select
          onChange={handeOnChangeItemPerPage}
          className="form-control"
          value={itemPerPage}
          style={{ width: '3rem' }}
        >
          <option>10</option>
          <option>20</option>
          <option>30</option>
          <option>40</option>
          <option>50</option>
        </select>
      </div>

      <div className="d-flex align-items-center btn-group" role="group">
        <button
          className={`btn btn-outline-primary d-flex align-self-center`}
          onClick={onPrev}
          disabled={page === 0}
        >
          <i className="material-icons">chevron_left</i>
        </button>

        <span className="m-h-8">Página: {page + 1}</span>

        <button
          className={`btn btn-outline-primary d-flex align-self-center`}
          onClick={onNext}
          disabled={!canNext}
        >
          <i className="material-icons">chevron_right</i>
        </button>
      </div>

      {/* <ul className="pagination">
        <li className="page-item"><a className="page-link" href="#">Anterior</a></li>
        <li className="page-item"><a className="page-link" href="#">1</a></li>
        <li className="page-item"><a className="page-link" href="#">2</a></li>
        <li className="page-item"><a className="page-link" href="#">3</a></li>
        <li className="page-item"><a className="page-link" href="#"></a></li>
        <li className="page-item"><a className="page-link" href="#">Siguiente</a></li>
      </ul> */}
    </div>
  );
};

const Table: React.FC<TableProps> = ({
  canNext = false,
  isLoading = false,
  itemPerPage = 20,
  keys = [],
  onChangeItemPerPage,
  onDeleteItem,
  onEditItem,
  onNextPage,
  onPrevPage,
  onSelectedRow,
  onViewItem,
  page = 0,
  selectedRows = [],
  showPagination = false,
  values = [],
}) => {
  const [valuesFilter, setValuesFilter] = useState<TableItemProps[]>([]);
  const [keyFilter, setkeyFilter] = useState({ key: '', ascendent: true });

  useEffect(() => {
    setValuesFilter(values);
    setkeyFilter({ key: '', ascendent: true });
  }, [values]);


  const onFilter = useCallback((key: string) => {
    const newKeyFilterState = {
      key,
      ascendent: key === keyFilter.key ? !keyFilter.ascendent : true,
    };

    setkeyFilter(newKeyFilterState);

    setValuesFilter((prev: TableItemProps[]) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) {
          return newKeyFilterState.ascendent ? -1 : 1;
        }

        if (a[key] > b[key]) {
          return newKeyFilterState.ascendent ? 1 : -1;
        }

        return 0;
      });
    });
  }, [keyFilter]);

  const isSelectedRow = useCallback((id: number) => {
    if (selectedRows.length === 0) {
      return false;
    }

    return selectedRows.findIndex(item => String(item) === String(id)) > -1;
  }, [selectedRows]);

  const onCheck = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { checked, value } } = event;

    if (!onSelectedRow) {
      return;
    }

    if (checked) {
      onSelectedRow((prev: string[]) => [...prev, value]);

      return;
    }

    onSelectedRow((prev: string[]) => prev.filter((item: string) => String(item) !== value));
  }, []);

  const onChekAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    if (!onSelectedRow) {
      return;
    }

    if (target.checked) {
      const checkAll: string[] = values.map(item => String(item['id'] | item['Id']));



      onSelectedRow(checkAll);
      return;
    }

    const empty: string[] = [];
    onSelectedRow(empty);
  }, [values]);

  const TableBody = () => (
    <>
      {
        valuesFilter && valuesFilter.map((item, index) => (
          <tr style={item.style} key={String(index)}>
            {onSelectedRow && (
              <td>
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={item['id'] || item['Id']}
                  onChange={onCheck}
                  checked={isSelectedRow(item['id'] || item['Id'])}
                />
              </td>
            )}

            {keys.map((headerKey) => (
              <td className="p-h-8" key={headerKey.key}>
                {item[headerKey.key || 'st']}
              </td>
            ))}

            {(onViewItem || onEditItem || onDeleteItem) &&
              <td className="flex-row">
                <ButtonGroup aria-label="Acciones">
                  {onViewItem && <TableButton
                    item={item}
                    onPress={onViewItem}
                    buttonType={BUTTON_TYPE.view}
                  />}

                  {onEditItem && <TableButton
                    item={item}
                    onPress={onEditItem}
                    buttonType={BUTTON_TYPE.edit}
                  />
                  }
                  {onDeleteItem && <TableButton
                    item={item}
                    onPress={onDeleteItem}
                    buttonType={BUTTON_TYPE.delete}
                  />}
                </ButtonGroup>
              </td>}
          </tr>
        ))
      }
    </>
  );

  const TableBodyShimmer = () => (
    <>
      <tr>
        {onSelectedRow && <td key="00"><Shimmer height="40px" /></td>}

        {keys.map((item, index) => (
          <td key={String(index)}><Shimmer height="40px" /></td>
        ))}
      </tr>

      <tr>
        <td key="00"><Shimmer height="40px" /></td>

        {keys.map((item, index) => (
          <td key={String(index)}><Shimmer height="40px" /></td>
        ))}
      </tr>
    </>
  );

  return (
    <>
      {onSelectedRow && (
        <div className="p-b-8">
          <span>{`Seleccionados ${selectedRows.length} de ${values.length}`}</span>
        </div>
      )}

      <BoostrapTable striped responsive hover className="custom-table">
        <thead className="grey lighten-4">
          <tr className="table-head">
            {onSelectedRow && (
              <td style={{ width: '40px' }}>
                <input type="checkbox" className="form-check-input" onChange={(onChekAll)} />
              </td>
            )}

            {keys.map((item, index) => (
              <td className={item.class} style={item.style} key={item.key || String(index)}>
                <button
                  className="btn p-0 button-filter d-flex"
                  onClick={() => onFilter(String(item.key))
                  } type="button">
                  {keyFilter.key === item.key && <MaterialIcon icon="import_export" />}

                  {item.value}
                </button>
              </td>
            ))}

            {
              (onViewItem || onDeleteItem || onEditItem) && <td style={styles.action}>Acciones</td>
            }
          </tr>
        </thead>

        <tbody>
          {isLoading ? (<TableBodyShimmer />) : <TableBody />}
        </tbody>

      </BoostrapTable>

      {showPagination && (
        <TablePagination
          canNext={canNext}
          itemPerPage={itemPerPage}
          onChangeItemPerPage={onChangeItemPerPage}
          onNext={onNextPage}
          onPrev={onPrevPage}
          page={page}
        />
      )}
    </>
  );
};

export { Table, TablePagination };
