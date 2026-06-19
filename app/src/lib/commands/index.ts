/**
 * Command pattern implementation for undo/redo system.
 *
 * Commands encapsulate document-mutating operations and provide
 * execute/undo capabilities for history management.
 *
 * This module was split from a single large `commands.ts` into
 * domain-grouped modules. This barrel re-exports the full public API
 * so existing import sites (`@/lib/commands`) stay unchanged.
 */

export type {
  CommandContext,
  Command,
  ElementSnapshot,
  RulerPropsPatch,
  ArrayParams,
  BooleanOpType,
} from "./types";

export { snapshotElements, syncCellTree } from "./helpers";

export {
  CreateRectangleCommand,
  DeleteElementsCommand,
  PasteElementsCommand,
  DuplicateElementsCommand,
  CreateArrayCommand,
  CreatePolygonCommand,
  CreatePathCommand,
  EditPathCommand,
  MoveElementsCommand,
  ChangeElementLayerCommand,
  ResizeElementsCommand,
  EditVerticesCommand,
  MoveElementsToCommand,
  AlignElementsCommand,
  BooleanOperationCommand,
} from "./element";

export {
  CreateRulerCommand,
  DeleteRulersCommand,
  MoveRulersCommand,
  MoveRulerEndpointCommand,
  MoveRulerPointCommand,
  UpdateRulerPropsCommand,
} from "./ruler";

export { AddLayerCommand, DeleteLayerCommand, EditLayerCommand } from "./layer";

export {
  SetInstanceTransformCommand,
  SetInstanceArrayCommand,
  FlattenArrayCommand,
} from "./instance";

export {
  AddCellCommand,
  AddChildCellCommand,
  DeleteCellCommand,
  FlattenCellCommand,
  SetCellOriginCommand,
  RenameCellCommand,
  AddCellRefCommand,
} from "./cell";

export {
  CreateTextCommand,
  UpdateTextContentCommand,
  MoveTextCommand,
  SetTextHeightCommand,
  TextToPolygonsCommand,
} from "./text";

export {
  AddImageCommand,
  RemoveImageCommand,
  MoveImageCommand,
  MoveImagesCommand,
  ResizeImageCommand,
} from "./image";

export {
  placeRectangleInViewport,
  placePolygonInViewport,
  placeTextInViewport,
  placePathInViewport,
} from "./viewport-placement";
