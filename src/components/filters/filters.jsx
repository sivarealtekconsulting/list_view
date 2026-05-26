import DynamicFieldFilter from './DynamicFieldFilter';

export function JobFilters({
  open = false,
  onClose,
  onApply,
  valueOptionsByField,
}) {
  return (
    <DynamicFieldFilter
      moduleName="jobs"
      open={open}
      onClose={onClose}
      onApply={onApply}
      valueOptionsByField={valueOptionsByField}
    />
  );
}

export default JobFilters;
