export * from "./types";
export * from "./services/materialsApi";
export * from "./hooks/useMaterials";
export * from "./hooks/useMaterialFilters";
export * from "./config/materials";
export { materialFiltersSchema, createMaterialSchema } from "./schemas/materialSchema";
export type { MaterialFiltersData, CreateMaterialRequest } from "./schemas/materialSchema";

export { MaterialHeader } from "./components/MaterialHeader";
export { MaterialFilters } from "./components/MaterialFilters";
export { MaterialsList } from "./components/MaterialsList";
export { MaterialCard } from "./components/MaterialCard";
export { MaterialForm } from "./components/MaterialForm";
export { CreateMaterialDialog } from "./components/CreateMaterialDialog";
export { EditMaterialDialog } from "./components/EditMaterialDialog";
export { DeleteMaterialDialog } from "./components/DeleteMaterialDialog";
export { RichTextEditor } from "./components/RichTextEditor";
export { HtmlRenderer } from "./components/HtmlRenderer";
export { MaterialDetailView } from "./components/MaterialDetailView";
export { StudentMaterialDetailView } from "./components/StudentMaterialDetailView";

