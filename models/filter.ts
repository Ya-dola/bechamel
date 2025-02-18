export interface Filter {
  column: string;
  // Allow an array of values for the "in" operator.
  value: string | number | boolean | null | (string | number | boolean)[];
  operator?:
    | 'eq'
    | 'not'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte'
    | 'like'
    | 'ilike'
    | 'is'
    | 'in';
}
