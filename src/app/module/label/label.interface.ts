// ============================================================
//  Label Module — Interfaces
// ============================================================

export interface ICreateLabelPayload {
  name: string;
  color: string;
}

export interface IUpdateLabelPayload {
  name?: string;
  color?: string;
}
