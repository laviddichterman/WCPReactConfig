import { useCallback, Dispatch, SetStateAction, useState } from "react";
import { format } from 'date-fns';
import { DISABLE_REASON, DisableDataCheck } from '@wcp/wcpshared';
import { GridActionsCellItem, GridRenderCellParams, GridRowId, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid-premium";
import { useGridApiRef } from "@mui/x-data-grid-premium";
import { AddBox, DeleteOutline, Edit, LibraryAdd, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch, useAppSelector } from "../../../../hooks/useRedux";
import { getPrinterGroupById } from '../../../../redux/slices/PrinterGroupSlice';
import TableWrapperComponent, { ToolbarAction } from "../../table_wrapper.component";

import { openProductClassCopy, openProductClassDelete, openProductClassDisable, openProductClassDisableUntilEod, openProductClassEdit, openProductClassEnable, openProductInstanceAdd } from "../../../../redux/slices/CatalogSlice";
import { RootState, localCreateSelector } from "../../../../redux/store";
import { getModifierTypeEntryById, getProductEntryById, getProductInstanceById } from "@wcp/wario-ux-shared";
import ProductInstanceTableContainer from "./product_instance_table.container";


type RowType = { id: string; disableData: ReturnType<typeof DisableDataCheck>; name: string }
type ValueGetterRow = GridValueGetterParams<RowType>;

const DisableDataToString = (disableData: ReturnType<typeof DisableDataCheck>) => {
  switch (disableData.enable) {
    case DISABLE_REASON.ENABLED: {
      return "False";
    }
    case DISABLE_REASON.DISABLED_BLANKET: {
      return "True";
    }
    case DISABLE_REASON.DISABLED_TIME: {
      return `${format(disableData.interval.start, "MMMM dd, y hh:mm a")} to ${format(disableData.interval.end, "MMMM dd, y hh:mm a")}`
    }
    case DISABLE_REASON.DISABLED_AVAILABILITY: {
      return "Disabled by Availability";
    }
  }
}


const selectRows = localCreateSelector(
  (s: RootState, _: string[]) => s.ws.products,
  (s: RootState, _: string[]) => s.ws.productInstances,
  (s: RootState, _: string[]) => s.ws.currentTime,
  (_: RootState, pids: string[]) => pids,
  (products, productInstances, currentTime, pids) => {
    return pids.map(x => {
      const productEntry = getProductEntryById(products, x);
      const name = getProductInstanceById(productInstances, productEntry.product.baseProductId)?.displayName ?? "UNDEFINED";
      return { id: x, disableData: DisableDataCheck(productEntry.product.disabled, null, currentTime), name }
    })
  }
);

const selectProductModifierList = localCreateSelector(
  (s: RootState, pid: string) => getProductEntryById(s.ws.products, pid),
  (s: RootState, _: string) => s.ws.modifierEntries,
  (product, modifiers) => {
    const mods = product.product.modifiers;
    return mods ? mods.map(x => getModifierTypeEntryById(modifiers, x.mtid).modifierType.name).join(", ") : "";
  }
);

const ProductModifierList = (params: GridRenderCellParams<RowType>) => {
  const displayString = useAppSelector(s => selectProductModifierList(s, params.row.id));
  return <>{displayString}</>;
}

const selectProductPrinterName = localCreateSelector(
  (s: RootState, pid: string) => getProductEntryById(s.ws.products, pid),
  (s: RootState, _: string) => s.printerGroup.printerGroups,
  (product, printerGroups) => {
    return product.product.printerGroup ? getPrinterGroupById(printerGroups, product.product.printerGroup)?.name ?? "" : ""
  }
);

const ProductPrinterGroupName = (params: GridRenderCellParams<RowType>) => {
  const displayString = useAppSelector(s => selectProductPrinterName(s, params.row.id));
  return <>{displayString}</>;
}

const selectProductPrice = localCreateSelector(
  (s: RootState, pid: string) => getProductEntryById(s.ws.products, pid),
  (product) => {
    return `$${Number(product.product.price.amount / 100).toFixed(2)}`;
  }
);

const ProductPrice = (params: GridRenderCellParams<RowType>) => {
  const displayString = useAppSelector(s => selectProductPrice(s, params.row.id));
  return <>{displayString}</>;
}

const ProductInstancesDetailPanel = ({ row }: { row: RowType }) => {
  const productEntry = useAppSelector(s => getProductEntryById(s.ws.products, row.id));
  return productEntry.instances.length ? <ProductInstanceTableContainer product_instance_ids={productEntry.instances.map(x => ({ id: x, base: productEntry.product.baseProductId === x }))} /> : <></>;
}

interface ProductTableContainerProps {
  product_ids: string[];
  setPanelsExpandedSize: Dispatch<SetStateAction<number>>;
  disableToolbar: boolean;
  pagination?: boolean;
  title?: string;
  toolbarActions?: ToolbarAction[];
}
const ProductTableContainer = ({
  product_ids,
  setPanelsExpandedSize,
  disableToolbar,
  pagination,
  title,
  toolbarActions
}: ProductTableContainerProps) => {
  const dispatch = useAppDispatch();
  const productIdRows = useAppSelector(s => selectRows(s, product_ids));
  // const productInstancesSizeByPro  ductId = useAppSelector(s => (pid: string) => getProductEntryById(s.ws.products, pid).instances.length);

  const [expandedRowIds, setExpandedRowIds] = useState<GridRowId[]>([]);
  const apiRef = useGridApiRef();
  const handleDetailPanelExpandedRowIdsChange = useCallback((ids: GridRowId[]) => {
    setExpandedRowIds(ids);
    // const size = ids.reduce((acc: number, rid: GridRowId) => {
    //   const v = acc + 41 + (productInstancesSizeByProductId(rid as string) * 36);
    //   return v;
    // }, 0) as number;
    // setPanelsExpandedSize(size);
  }, []);
  const handleToggleDetailPanel = useCallback((id: GridRowId) => {
    const rowIdIdx = expandedRowIds.indexOf(id);
    if (rowIdIdx === -1) {
      handleDetailPanelExpandedRowIdsChange([...expandedRowIds, id]);
    } else {
      const newRows = expandedRowIds.filter(x => x !== id)
      handleDetailPanelExpandedRowIdsChange(newRows);
    }
  }, [expandedRowIds])
  // const getDetailPanelHeight = useCallback(({ row }: { row: RowType }) => { const size = productInstancesSizeByProductId(row.id); return size ? (41 + (size * 36)) : 0; }, []);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <TableWrapperComponent
        disableToolbar={disableToolbar}
        apiRef={apiRef}
        initialState={pagination ? {
          pagination: {
            paginationModel: { pageSize: 25 }
          },
        } : undefined}
        columns={[{
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<RowType>) => {
            const ADD_PRODUCT_INSTANCE = (<GridActionsCellItem
              icon={<Tooltip title={`Add Product Instance to ${params.row.name}`}><AddBox /></Tooltip>}
              label={`Add Product Instance to ${params.row.name}`}
              onClick={() => dispatch(openProductInstanceAdd(params.row.id))}
            />);
            const EDIT_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Edit ${params.row.name}`}><Edit /></Tooltip>}
              label={`Edit ${params.row.name}`}
              onClick={() => dispatch(openProductClassEdit(params.row.id))}
            />);
            const ENABLE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Enable ${params.row.name}`}><CheckCircle /></Tooltip>}
              label={`Enable ${params.row.name}`}
              onClick={() => dispatch(openProductClassEnable(params.row.id))}
              showInMenu
            />);
            const DISABLE_PRODUCT_UNTIL_EOD = (<GridActionsCellItem
              icon={<Tooltip title={`Disable ${params.row.name} Until End-of-Day`}><BedtimeOff /></Tooltip>}
              label={`Disable ${params.row.name} Until EOD`}
              onClick={() => dispatch(openProductClassDisableUntilEod(params.row.id))}
              showInMenu
            />);
            const DISABLE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Disable ${params.row.name}`}><Cancel /></Tooltip>}
              label={`Disable ${params.row.name}`}
              onClick={() => dispatch(openProductClassDisable(params.row.id))}
              showInMenu
            />);
            const COPY_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Copy ${params.row.name}`}><LibraryAdd /></Tooltip>}
              label={`Copy ${params.row.name}`}
              onClick={() => dispatch(openProductClassCopy(params.row.id))}
              showInMenu
            />);
            const DELETE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Delete ${params.row.name}`}><DeleteOutline /></Tooltip>}
              label={`Delete ${params.row.name}`}
              onClick={() => dispatch(openProductClassDelete(params.row.id))}
              showInMenu
            />);
            // we pass null instead of actually passing the availability because we want to make a decision based on just the .disabled value
            return params.row.disableData.enable !== DISABLE_REASON.ENABLED ? [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, ENABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT] : [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, DISABLE_PRODUCT_UNTIL_EOD, DISABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT];
          }
        },
        { headerName: "Name", field: "display_name", valueGetter: (v: ValueGetterRow) => v.row.name, flex: 6 },
        { headerName: "Price", field: "product.price.amount", renderCell: (params) => <ProductPrice {...params} /> },
        { headerName: "Modifiers", field: "product.modifiers", renderCell: (params) => <ProductModifierList {...params} />, flex: 3 },
        { headerName: "Printer", field: "product.printerGroup", renderCell: (params) => <ProductPrinterGroupName {...params} />, flex: 3 },
        { headerName: "Disabled", field: "product.disabled", valueGetter: (v: ValueGetterRow) => DisableDataToString(v.row.disableData), flex: 1 },
        ]}
        rows={productIdRows}
        title={title}
        toolbarActions={toolbarActions}
        pagination={pagination}
        hideFooter={pagination !== true}
        getRowId={(row: RowType) => row.id}

        getDetailPanelContent={(params) => <ProductInstancesDetailPanel {...params} />}
        getDetailPanelHeight={() => 'auto'}
        onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
        // rowThreshold={0}
        onRowClick={(params) => handleToggleDetailPanel(params.id)}
        detailPanelExpandedRowIds={expandedRowIds}
      />
    </div>
  );
};

export default ProductTableContainer;
