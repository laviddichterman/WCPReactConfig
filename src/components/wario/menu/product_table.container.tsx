import { useCallback, Dispatch, SetStateAction } from "react";
import { format } from 'date-fns';
import { DisableDataCheck, DISABLE_REASON, IProduct, IProductInstance } from '@wcp/wcpshared';
import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit, LibraryAdd, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { useAppSelector } from "../../../hooks/useRedux";
import TableWrapperComponent from "../table_wrapper.component";

type RowType = { product: IProduct; instances: IProductInstance[]; }
type ValueGetterRow = GridValueGetterParams<any, RowType>;

interface ProductTableContainerProps {
  products: RowType[];
  setProductToEdit: Dispatch<SetStateAction<IProduct | null>>;
  setIsProductEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductCopyOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductDisableOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductDisableUntilEodOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductEnableOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceAddOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsProductInstanceDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setProductInstanceToEdit: Dispatch<SetStateAction<IProductInstance | null>>;
  setPanelsExpandedSize: Dispatch<SetStateAction<number>>;
}
const ProductTableContainer = ({
  products,
  setProductToEdit,
  setIsProductEditOpen,
  setIsProductCopyOpen,
  setIsProductDeleteOpen,
  setIsProductDisableOpen,
  setIsProductDisableUntilEodOpen,
  setIsProductEnableOpen,
  setIsProductInstanceAddOpen,
  setIsProductInstanceEditOpen,
  setIsProductInstanceDeleteOpen,
  setProductInstanceToEdit,
  setPanelsExpandedSize
}: ProductTableContainerProps) => {
  const catalog = useAppSelector(s => s.ws.catalog!);
  const CURRENT_TIME = useAppSelector(s=>s.ws.currentTime);

  const apiRef = useGridApiRef();

  const addProductInstance = (row: RowType) => () => {
    setIsProductInstanceAddOpen(true);
    setProductToEdit(row.product);
  };
  const editProduct = (row: RowType) => () => {
    setIsProductEditOpen(true);
    setProductToEdit(row.product);
  };
  const deleteProduct = (row: RowType) => () => {
    setIsProductDeleteOpen(true);
    setProductToEdit(row.product);
  };
  const copyProduct = (row: RowType) => () => {
    setIsProductCopyOpen(true);
    setProductToEdit(row.product);
  };
  const enableProduct = (row: RowType) => () => {
    setIsProductEnableOpen(true);
    setProductToEdit(row.product);
  };
  const disableProductUntilEOD = (row: RowType) => () => {
    setIsProductDisableUntilEodOpen(true);
    setProductToEdit(row.product);
  };
  const disableProduct = (row: RowType) => () => {
    setIsProductDisableOpen(true);
    setProductToEdit(row.product);
  };

  // this assumes a single base product instance per product class.
  // assumption is that this precondition is enforced by the service
  const GetIndexOfBaseProductInstance = useCallback((instances: IProductInstance[]) =>
    instances.findIndex((pi) => pi.isBase), []);

  const getDetailPanelHeight = useCallback(({ row }: { row: RowType }) => row.instances.length ? (41 + (row.instances.length * 36)) : 0, []);

  const getDetailPanelContent = useCallback(({ row }: { row: RowType }) => row.instances.length ? (
    <TableWrapperComponent
      disableToolbar
      columns={[
        {
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params) => [
            <GridActionsCellItem
              key={`EDIT${row.product.id}`}
              icon={<Tooltip title="Edit Product Instance"><Edit /></Tooltip>}
              label="Edit Product Instance"
              onClick={(() => {
                setIsProductInstanceEditOpen(true);
                setProductToEdit(row.product);
                setProductInstanceToEdit(params.row);
              })}
            />,
            <GridActionsCellItem
              key={`DEL${row.product.id}`}
              icon={<Tooltip title="Delete Product Instance"><DeleteOutline /></Tooltip>}
              label="Delete Product Instance"
              onClick={(() => {
                setIsProductInstanceDeleteOpen(true);
                setProductInstanceToEdit(params.row)
              })}
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
      rows={row.instances}
      getRowId={(row_inner) => row_inner.id}
    />) :
    (""),
    [setIsProductInstanceDeleteOpen, setIsProductInstanceEditOpen, setProductInstanceToEdit, setProductToEdit]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <TableWrapperComponent
        disableToolbar
        apiRef={apiRef}
        columns={[{
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<RowType>) => {
            const base_piidx = GetIndexOfBaseProductInstance(params.row.instances);
            const title = base_piidx !== -1 ? params.row.instances[base_piidx].displayName : "Incomplete Product";
            const ADD_PRODUCT_INSTANCE = (<GridActionsCellItem
              icon={<Tooltip title={`Add Product Instance to ${title}`}><AddBox /></Tooltip>}
              label={`Add Product Instance to ${title}`}
              onClick={addProductInstance(params.row)}
            />);
            const EDIT_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Edit ${title}`}><Edit /></Tooltip>}
              label={`Edit ${title}`}
              onClick={editProduct(params.row)}
            />);
            const ENABLE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Enable ${title}`}><CheckCircle /></Tooltip>}
              label={`Enable ${title}`}
              onClick={enableProduct(params.row)}
              showInMenu
            />);
            const DISABLE_PRODUCT_UNTIL_EOD = (<GridActionsCellItem
              icon={<Tooltip title={`Disable ${title} Until End-of-Day`}><BedtimeOff /></Tooltip>}
              label={`Disable ${title} Until EOD`}
              onClick={disableProductUntilEOD(params.row)}
              showInMenu
            />);
            const DISABLE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Disable ${title}`}><Cancel /></Tooltip>}
              label={`Disable ${title}`}
              onClick={disableProduct(params.row)}
              showInMenu
            />);
            const COPY_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Copy ${title}`}><LibraryAdd /></Tooltip>}
              label={`Copy ${title}`}
              onClick={copyProduct(params.row)}
              showInMenu
            />);
            const DELETE_PRODUCT = (<GridActionsCellItem
              icon={<Tooltip title={`Delete ${title}`}><DeleteOutline /></Tooltip>}
              label={`Delete ${title}`}
              onClick={deleteProduct(params.row)}
              showInMenu
            />);
            return DisableDataCheck(params.row.product.disabled, CURRENT_TIME).enable !== DISABLE_REASON.ENABLED ? [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, ENABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT] : [ADD_PRODUCT_INSTANCE, EDIT_PRODUCT, DISABLE_PRODUCT_UNTIL_EOD, DISABLE_PRODUCT, COPY_PRODUCT, DELETE_PRODUCT];
          }
        },
        { headerName: "Name", field: "display_name", valueGetter: (v: ValueGetterRow) => GetIndexOfBaseProductInstance(v.row.instances) !== -1 ? v.row.instances[GetIndexOfBaseProductInstance(v.row.instances)].displayName : "Incomplete Product", flex: 6 },
        { headerName: "Price", field: "product.price.amount", valueGetter: (v : ValueGetterRow) => `$${Number(v.row.product.price.amount / 100).toFixed(2)}` },
        { headerName: "Modifiers", field: "product.modifiers", valueGetter: (v: ValueGetterRow) => v.row.product.modifiers ? v.row.product.modifiers.map(x => catalog.modifiers[x.mtid].modifier_type.name).join(", ") : "", flex: 3 },
        // eslint-disable-next-line no-nested-ternary
        { headerName: "Disabled", field: "product.disabled", valueGetter: (v: ValueGetterRow) => v.row.product.disabled !== null && DisableDataCheck(v.row.product.disabled, CURRENT_TIME).enable !== DISABLE_REASON.ENABLED ? (v.row.product.disabled.start > v.row.product.disabled.end ? "True" : `${format(v.row.product.disabled.start, "MMMM dd, y hh:mm a")} to ${format(v.row.product.disabled.end, "MMMM dd, y hh:mm a")}`) : "False", flex: 1 },
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
