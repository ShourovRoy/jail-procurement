export interface ErrorModel {
  status_code: number; // i16 translates to number
  error_message: string;
}

export interface DataRes<T> {
  message: string;
  // data is optional/nullable depending on Serde serialization config
  data?: T | null;
}

export interface GlobalRes<T> {
  // If success is present, it wraps DataRes with the inner type T
  success?: DataRes<T> | null;
  // If error is present, it contains the ErrorModel shape
  error?: ErrorModel | null;
}
