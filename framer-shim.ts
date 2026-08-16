// Local development shim for Framer's runtime module.
// In the Framer web/desktop canvas, Framer automatically provides this module natively.
export const ControlType = {
  Boolean: "Boolean",
  Color: "Color",
  ComponentInstance: "ComponentInstance",
  Enum: "Enum",
  File: "File",
  Image: "Image",
  Number: "Number",
  String: "String",
  Object: "Object",
  Array: "Array",
  EventHandler: "EventHandler",
  Transition: "Transition",
} as const

export function addPropertyControls(component: any, controls: any) {
  if (component) {
    component.propertyControls = controls
  }
}
