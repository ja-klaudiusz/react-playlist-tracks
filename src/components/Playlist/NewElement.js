import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import Modal from "../UiElements/Modal";
import { newTrack, newElement } from "../../redux/data/dataSlice";
import CreatableSelectControlled from "../UiElements/CreatableSelectControlled";
import InputText from "../UiElements/InputText";
import InputNumber from "../UiElements/InputNumber";
import useDebounce from "../../hooks/use-debounce";

const NewElement = ({ onClose }) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    setValue,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: true,
    defaultValues: {},
  });
  const tracks = useSelector((state) => state.data.tracks);
  const tracksArray = Object.keys(tracks).map((track) => {
    return { value: track, label: tracks[track].name };
  });

  const [show, setShow] = useState(true);
  const { startTime, length } = watch();

  const debouncedStartTime = useDebounce(startTime, 700);
  const debouncedLength = useDebounce(length, 700);

  const handleRejectModal = () => {
    setShow(false);
    onClose();
  };
  const handleConfirmModal = (data) => {
    dispatch(
      newElement({
        trackId: data.track,
        elementName: data.title,
        elemPeriodStart: parseInt(data.startTime),
        elemPeriodEnd: parseInt(data.startTime) + parseInt(data.length),
      })
    );
    setShow(false);
    onClose();
  };

  const handleChange = (newValue) => {};

  const handleCreate = (inputValue) => {
    const id = uuidv4();
    const track = { id, track: { name: inputValue } };
    dispatch(newTrack({ ...track }));
    return track;
  };

  useEffect(() => {
    setValue(
      "startTime",
      Math.round(parseInt(debouncedStartTime) / 100) * 100 || 0
    );
  }, [debouncedStartTime]);

  useEffect(() => {
    setValue(
      "length",
      Math.round(parseInt(debouncedLength) / 100) * 100 || 100
    );
  }, [debouncedLength]);

  return (
    <Modal
      title="Add new element"
      showModal={show}
      onReject={handleRejectModal}
      onConfirm={handleSubmit(handleConfirmModal)}
    >
      <div className="grid grid-cols-2 gap-4 text-slate-600 text-left text-sm">
        <div>
          <CreatableSelectControlled
            name="track"
            control={control}
            label="Select track"
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={tracksArray}
            required={"Track required"}
          />
        </div>
        <div>
          <InputText
            name="title"
            placeholder="Title"
            register={register}
            required={"Title required"}
            error={errors["title"]}
          />
        </div>
        <div>
          <InputNumber
            name="startTime"
            placeholder="Start time"
            register={register}
            required={"Start time required"}
            error={errors["startTime"]}
          />
        </div>
        <div>
          <InputNumber
            name="length"
            placeholder="Element length"
            register={register}
            required={"Element length required"}
            error={errors["length"]}
          />
        </div>
      </div>
    </Modal>
  );
};

export default NewElement;
