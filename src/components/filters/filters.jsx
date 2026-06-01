import DynamicFieldFilter from './DynamicFieldFilter';

export function JobFilters({
  moduleName = 'jobs',
  open = false,
  onClose,
  onApply,
}) {
  return (
    <DynamicFieldFilter
      moduleName={moduleName}
      open={open}
      onClose={onClose}
      onApply={onApply}
    />
  );
}

export default JobFilters;
