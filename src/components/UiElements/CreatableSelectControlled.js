import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { Controller } from "react-hook-form";

const CreatableSelectControlled = ({
  label,
  name,
  options = [],
  control,
  onCreateOption,
  onChange,
  required = false,
  defaultValue = null,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newOption, setNewOption] = useState(null);

  const handleChange = (newValue) => {
    setNewOption(newValue);
    onChange(newValue);
  };

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setIsLoading(false);
    const track = onCreateOption(inputValue);
    setNewOption({ value: track.id, label: track.track.name });
    return track.id;
  };

  useEffect(() => {
    defaultValue && setNewOption(defaultValue);
  }, [defaultValue]);

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur }, fieldState: { error } }) => {
          return (
            <>
              <CreatableSelect
                isClearable
                onBlur={onBlur}
                placeholder={label}
                isDisabled={isDisabled || isLoading}
                isLoading={isLoading}
                onChange={(option) => {
                  handleChange(option);
                  return onChange(option?.value);
                }}
                onCreateOption={(value) => {
                  onChange(handleCreate(value));
                }}
                options={options}
                value={newOption}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #fff",
                    WebkitBoxShadow: "0px 1px 4px 0px rgb(220 220 220)",
                    MozBoxShadow: "0px 1px 4px 0px rgb(220 220 220)",
                    boxShadow: "0px 1px 4px 0px rgb(220 220 220)",
                    padding: "3px 0px",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    color: "#cbd5e1",
                  }),
                }}
              />
              {error ? (
                <p className="text-red-500 text-xs pt-2">{error.message}</p>
              ) : null}
            </>
          );
        }}
      />
    </div>
  );
};

export default CreatableSelectControlled;
