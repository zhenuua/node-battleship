export interface IFrame {
  type: string;
  data: string;
  id: number
}

interface IShipPosition {
  x: number,
  y: number,
}

export interface IShip {
  position: IShipPosition,
  direction: boolean,
  type: "huge" | "large" | "medium" | "small",
  length: number
}