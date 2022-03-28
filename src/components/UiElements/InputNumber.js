import React from "react";

const InputNumber = ({
  register,
  name,
  placeholder,
  required = false,
  error,
}) => {
  return (
    <>
      <input
        type="number"
        {...register(name, { required })}
        placeholder={placeholder}
        className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded border-0 shadow outline-none focus:outline-none focus:ring w-full"
      />
      {error ? (
        <p className="text-red-500 text-xs pt-2">{error.message}</p>
      ) : null}
    </>
  );
};

export default InputNumber;
