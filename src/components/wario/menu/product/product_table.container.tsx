import { useCallback, Dispatch, SetStateAction, useState, useMemo } from "react";
import { format } from 'date-fns';
import { DisableDataCheck, DISABLE_REASON, IProduct, IProductInstance, ReduceArrayToMapByKey } from '@wcp/wcpshared';
import { GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import { useGridApiRef } from "@mui/x-data-grid-pro";
import { AddBox, DeleteOutline, Edit, LibraryAdd, BedtimeOff, CheckCircle, Cancel } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { useAppSelector } from "../../../../hooks/useRedux";
import { getPrinterGroups } from '../../../../redux/slices/PrinterGroupSlice';
import TableWrapperComponent from "../../table_wrapper.component";
import ProductEditContainer from "./product.edit.container";
import ProductCopyContainer from "./product.copy.container";
import ProductDeleteContainer from "./product.delete.container";
import ProductDisableUntilEodContainer from "./product.disable_until_eod.container";
import ProductDisableContainer from "./product.disable.container";
import ProductEnableContainer from "./product.enable.container";
import ProductInstanceAddContainer from "./instance/product_instance.add.container";
import ProductInstanceEditContainer from "./instance/product_instance.edit.container";
import ProductInstanceDeleteContainer from "./instance/product_instance.delete.container";

import { DialogContainer } from "@wcp/wario-ux-shared";

type RowType = { product: IProduct; instances: string[]; }
type ValueGetterRow = GridValueGetterParams<any, RowType>;

interface ProductTableContainerProps {
  products: RowType[];
  setPanelsExpandedSize: Dispatch<SetStateAction<number>>;
}
const ProductTableContainer = ({
  products,
  setPanelsExpandedSize
}: ProductTableContainerProps) => {
  const catalog = useAppSelector(s => s.ws.catalog!);
  const CURRENT_TIME = useAppSelector(s=>s.ws.currentTime);

  const apiRef = useGridApiRef();

  const [isProductEditOpen, setIsProductEditOpen] = useState(false);
  const [isProductDisableUntilEodOpen, setIsProductDisableUntilEodOpen] = useState(false);
  const [isProductDisableOpen, setIsProductDisableOpen] = useState(false);
  const [isProductEnableOpen, setIsProductEnableOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);

  const [isProductDeleteOpen, setIsProductDeleteOpen] = useState(false);
  const [isProductCopyOpen, setIsProductCopyOpen] = useState(false);

  const [isProductInstanceAddOpen, setIsProductInstanceAddOpen] = useState(false);
  const [isProductInstanceDeleteOpen, setIsProductInstanceDeleteOpen] = useState(false);
  const [isProductInstanceEditOpen, setIsProductInstanceEditOpen] = useState(false);
  const [productInstanceToEdit, setProductInstanceToEdit] = useState<IProductInstance|null>(null);

  const printerGroups = useAppSelector(s => ReduceArrayToMapByKey(getPrinterGroups(s.printerGroup.printerGroups), 'id'));

    // this assumes a single base product instance per product class.
  // assumption is that this precondition is enforced by the service
  const nameOfBaseProductInstance = useMemo(() => {
    const piid = productToEdit?.baseProductId ?? null;
    return piid !== null ? catalog.productInstances[piid].displayName : "Incomplete Product";
  }, [catalog, productToEdit]);


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
              disabled={row.product.baseProductId === params.row.id}
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
      rows={row.instances.map(x=>catalog.productInstances[x])}
      getRowId={(row_inner) => row_inner.id}
    />) :
    (""),
    [setIsProductInstanceDeleteOpen, setIsProductInstanceEditOpen, setProductInstanceToEdit, setProductToEdit, catalog.productInstances]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product"}
        onClose={() => setIsProductEditOpen(false)}
        open={isProductEditOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductEditContainer
            onCloseCallback={() => setIsProductEditOpen(false)}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        title={"Disable Product Until End-of-Day"}
        onClose={() => setIsProductDisableUntilEodOpen(false)}
        open={isProductDisableUntilEodOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductDisableUntilEodContainer
            onCloseCallback={() => setIsProductDisableUntilEodOpen(false)}
            product={productToEdit}
            productName={nameOfBaseProductInstance}
          />
        }
      />
      <DialogContainer
        title={"Disable Product"}
        onClose={() => setIsProductDisableOpen(false)}
        open={isProductDisableOpen}
        innerComponent={
          productToEdit !== null &&
          <ProductDisableContainer
            onCloseCallback={() => setIsProductDisableOpen(false)}
            productName={nameOfBaseProductInstance}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        title={"Enable Product"}
        onClose={() => setIsProductEnableOpen(false)}
        open={isProductEnableOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductEnableContainer
            onCloseCallback={() => setIsProductEnableOpen(false)}
            product={productToEdit}
            productName={nameOfBaseProductInstance}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Copy Product"}
        onClose={() => setIsProductCopyOpen(false)}
        open={isProductCopyOpen}
        innerComponent={
          productToEdit !== null && 
          <ProductCopyContainer
            onCloseCallback={() => setIsProductCopyOpen(false)}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Product"}
        onClose={() => setIsProductDeleteOpen(false)}
        open={isProductDeleteOpen}
        innerComponent={
          productToEdit !== null &&
          <ProductDeleteContainer
            onCloseCallback={() => setIsProductDeleteOpen(false)}
            productName={nameOfBaseProductInstance}
            product={productToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={`Add Product Instance for: ${nameOfBaseProductInstance}`}
        onClose={() => setIsProductInstanceAddOpen(false)}
        open={isProductInstanceAddOpen}
        innerComponent={
          productToEdit !== null &&
          <ProductInstanceAddContainer
            onCloseCallback={() => setIsProductInstanceAddOpen(false)}
            parent_product={productToEdit}
          />
        }
      />
      <DialogContainer
        maxWidth={"xl"}
        title={"Edit Product Instance"}
        onClose={() => setIsProductInstanceEditOpen(false)}
        open={isProductInstanceEditOpen}
        innerComponent={
          productToEdit !== null && productInstanceToEdit !== null &&
          <ProductInstanceEditContainer
            onCloseCallback={() => setIsProductInstanceEditOpen(false)}
            parent_product={productToEdit}
            product_instance={productInstanceToEdit}
          />
        }
      />
      <DialogContainer
        title={"Delete Product Instance"}
        onClose={() => setIsProductInstanceDeleteOpen(false)}
        open={isProductInstanceDeleteOpen}
        innerComponent={
          productInstanceToEdit !== null &&
          <ProductInstanceDeleteContainer
            onCloseCallback={() => setIsProductInstanceDeleteOpen(false)}
            product_instance={productInstanceToEdit}
          />
        }
      />
      <TableWrapperComponent
        disableToolbar
        apiRef={apiRef}
        columns={[{
          headerName: "Actions",
          field: 'actions',
          type: 'actions',
          getActions: (params: GridRowParams<RowType>) => {
            const base_piid = params.row.product.baseProductId;
            const title = base_piid !== null ? catalog.productInstances[base_piid].displayName : "Incomplete Product";
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
        { headerName: "Name", field: "display_name", valueGetter: (v: ValueGetterRow) => catalog.productInstances[v.row.product.baseProductId].displayName, flex: 6 },
        { headerName: "Price", field: "product.price.amount", valueGetter: (v : ValueGetterRow) => `$${Number(v.row.product.price.amount / 100).toFixed(2)}` },
        { headerName: "Modifiers", field: "product.modifiers", valueGetter: (v: ValueGetterRow) => v.row.product.modifiers ? v.row.product.modifiers.map(x => catalog.modifiers[x.mtid].modifierType.name).join(", ") : "", flex: 3 },
        { headerName: "Printer", field: "product.printerGroup", valueGetter: (v: ValueGetterRow) => printerGroups && v.row.product.printerGroup && printerGroups[v.row.product.printerGroup] ? printerGroups[v.row.product.printerGroup].name : "", flex: 3 },
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
