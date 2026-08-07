// all unit related definition will be here

export interface Unit {
  id: string;
  name: string;
  short_name: string;
  created_by: string;
}

export interface UnitWithCreator<T> {
  unit: Unit;
  creator: T;
}

export interface UnitsDataRes<T> {
  units: UnitWithCreator<T>[];
}
