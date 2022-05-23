import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const Group = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
);

const TimeSelection = ({value, disabled, onChange, className, options, optionCaption="Time", isOptionDisabled=(x) => x.disabled}) => (
  <Select
    options={[{
      label: optionCaption,
      options
    }]}
    className={className}
    formatGroupLabel={Group}
    onChange={onChange}
    value={value}
    isDisabled={disabled}
    isOptionDisabled={isOptionDisabled}
    />
);

export default TimeSelection;