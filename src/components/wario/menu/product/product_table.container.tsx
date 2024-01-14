import { useCallback, Dispatch, SetStateAction } from "react";
import { format } from 'date-fns';
import { DisableDataCheck, DISABLE_REASON, IProduct, IProductInstance, ReduceArrayToMapByKey } from '@wcp/wcpshared';
import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit, LibraryAdd, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch, useAppSelector } from "../../../../hooks/useRedux";
import { getPrinterGroups } from '../../../../redux/slices/PrinterGroupSlice';
import TableWrapperComponent from "../../table_wrapper.component";

import { openProductClassCopy, openProductClassDelete, openProductClassDisable, openProductClassDisableUntilEod, openProductClassEdit, openProductClassEnable, openProductInstanceAdd, openProductInstanceDelete, openProductInstanceEdit } from "../../../../redux/slices/CatalogSlice";

type RowType = { product: IProduct; instances: string[]; }
type ValueGetterRow = GridValueGetterParams<any, RowType>;

interface ProductTableContainerProps {
  products: RowType[];
  setPanelsExpandedSize: Dispatch<SetStateAction<number>>;
  disableToolbar: boolean;
}
const ProductTableContainer = ({
  products,
  setPanelsExpandedSize,
  disableToolbar
}: ProductTableContainerProps) => {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector(s => s.ws.catalog!);
  const CURRENT_TIME = useAppSelector(s=>s.ws.currentTime);

  const apiRef = useGridApiRef();

  const printerGroups = useAppSelector(s => ReduceArrayToMapByKey(getPrinterGroups(s.printerGroup.printerGroups), 'id'));

  const getDetailPanelHeight = useCallback(({ row }: { row: RowType }) => row.instances.length ? (41 + (row.instances.length * 36)) : 0, []);

  const getDetailPanelContent = useCallback(({ row }: { row: RowType }) => row.instances.length ? (
    <TableWrapperComponent
      disableToolbar
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params : GridRowParams<IProductInstance>) => [
            <GridActionsCellItem
              placeholder
              key={`EDIT${row.product.id}`}
              icon={<Tooltip title="Edit Product Instance"><Edit /></Tooltip>}
              label="Edit Product Instance"
              onClick={() => dispatch(openProductInstanceEdit(params.row.id))}
            />,
            <GridActionsCellItem
              placeholder
              key={`DEL${row.product.id}`}
              disabled={row.product.baseProductId === params.row.id}
              icon={<Tooltip title="Delete Product Instance"><DeleteOutline /></Tooltip>}
              label="Delete Product Instance"
              onClick={() => dispatch(openProductInstanceDelete(params.row.id))}
            />
          ]
        },
        { headerName: "Name", field: "item.display_name", valueGetter: (v: { row: IProductInstance }) => v.row.displayName, flex: 1 },
        { headerName: "Ordinal", field: "ordinal", valueGetter: (v: { row: IProductInstance }) => v.row.ordinal },
        { headerName: "Menu Ordinal", field: "menuOrdinal", valueGetter: (v: { row: IProductInstance }) => v.row.displayFlags.menu.ordinal || 0 },
        { headerName: "Order Ordinal", field: "orderOrdinal", valueGetter: (v: { row: IProductInstance }) => v.row.displayFlags.order.ordinal || 0 },
        { headerName: "Shortcode", field: "item.shortcode", valueGetter: (v: { row: IProductInstance }) => v.row.shortcode },
        { headerName: "Description", field: "item.description", valueGetter: (v: { row: IProductInstance }) => v.row.description },

      ]}
      rows={row.instances.map(x=>catalog.productInstances[x])}
      getRowId={(row_inner) => row_inner.id}
    />) :
    (""),
    [dispatch, catalog.productInstances]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      
      <TableWrapperComponent
        disableToolbar={disableToolbar}
        apiRef={apiRef}
        columns={[{
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<RowType>) => {
            const base_piid = params.row.product.baseProductId;
            const title = base_piid !== null ? catalog.productInstances[base_piid].displayName : "Incomplete Product";
            const ADD_PRODUCT_INSTANCE = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Add Product Instance to ${title}`}><AddBox /></Tooltip>}
              label={`Add Product Instance to ${title}`}
              onClick={() => dispatch(openProductInstanceAdd(params.row.product.id))}
            />);
            const EDIT_PRODUCT = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Edit ${title}`}><Edit /></Tooltip>}
              label={`Edit ${title}`}
              onClick={() => dispatch(openProductClassEdit(params.row.product.id))}
            />);
            const ENABLE_PRODUCT = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Enable ${title}`}><CheckCircle /></Tooltip>}
              label={`Enable ${title}`}
              onClick={() => dispatch(openProductClassEnable(params.row.product.id))}
              showInMenu
            />);
            const DISABLE_PRODUCT_UNTIL_EOD = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Disable ${title} Until End-of-Day`}><BedtimeOff /></Tooltip>}
              label={`Disable ${title} Until EOD`}
              onClick={() => dispatch(openProductClassDisableUntilEod(params.row.product.id))}
              showInMenu
            />);
            const DISABLE_PRODUCT = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Disable ${title}`}><Cancel /></Tooltip>}
              label={`Disable ${title}`}
              onClick={() => dispatch(openProductClassDisable(params.row.product.id))}
              showInMenu
            />);
            const COPY_PRODUCT = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Copy ${title}`}><LibraryAdd /></Tooltip>}
              label={`Copy ${title}`}
              onClick={() => dispatch(openProductClassCopy(params.row.product.id))}
              showInMenu
            />);
            const DELETE_PRODUCT = (<GridActionsCellItem
              placeholder
              icon={<Tooltip title={`Delete ${title}`}><DeleteOutline /></Tooltip>}
              label={`Delete ${title}`}
              onClick={() => dispatch(openProductClassDelete(params.row.product.id))}
              showInMenu
            />);
            // we pass null instead of actually passing the availability because we want to make a decision based on just the .disabled value
            return DisableDataCheck(params.row.product.disabled, null, CURRENT_TIME).enable !== DISABLE_REASON.ENABLED ? [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, ENABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT] : [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, DISABLE_PRODUCT_UNTIL_EOD, DISABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT];
          }
        },
        { headerName: "Name", field: "display_name", valueGetter: (v: ValueGetterRow) => catalog.productInstances[v.row.product.baseProductId].displayName, flex: 6 },
        { headerName: "Price", field: "product.price.amount", valueGetter: (v : ValueGetterRow) => `$${Number(v.row.product.price.amount / 100).toFixed(2)}` },
        { headerName: "Modifiers", field: "product.modifiers", valueGetter: (v: ValueGetterRow) => v.row.product.modifiers ? v.row.product.modifiers.map(x => catalog.modifiers[x.mtid].modifierType.name).join(", ") : "", flex: 3 },
        { headerName: "Printer", field: "product.printerGroup", valueGetter: (v: ValueGetterRow) => printerGroups && v.row.product.printerGroup && printerGroups[v.row.product.printerGroup] ? printerGroups[v.row.product.printerGroup].name : "", flex: 3 },
        // we pass null instead of actually passing the availability because we want to make a decision based on just the .disabled value
        // eslint-disable-next-line no-nested-ternary 
        { headerName: "Disabled", field: "product.disabled", valueGetter: (v: ValueGetterRow) => v.row.product.disabled !== null && DisableDataCheck(v.row.product.disabled, null, CURRENT_TIME).enable !== DISABLE_REASON.ENABLED ? (v.row.product.disabled.start > v.row.product.disabled.end ? "True" : `${format(v.row.product.disabled.start, "MMMM dd, y hh:mm a")} to ${format(v.row.product.disabled.end, "MMMM dd, y hh:mm a")}`) : "False", flex: 1 },
        ]}
        rows={products}
        getRowId={(row: RowType) => row.product.id}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={getDetailPanelHeight}
        onDetailPanelExpandedRowIdsChange={(ids: number[]) => setPanelsExpandedSize(ids.reduce((acc, rid) => acc + 41 + (catalog.products[rid].instances.length * 36), 0))}
        rowThreshold={0}
        onRowClick={(params,) => apiRef.current.toggleDetailPanel(params.id)}
      />
    </div>
  );
};

export default ProductTableContainer;
