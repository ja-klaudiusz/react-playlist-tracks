import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import Modal from "../Modal";
import {
  newTrack,
  setElementInEdit,
  updateElementDetails,
} from "../../redux/data/dataSlice";
import CreatableSelectControlled from "../UiElements/CreatableSelectControlled";
import InputText from "../UiElements/InputText";
import InputNumber from "../UiElements/InputNumber";
import useDebounce from "../../hooks/use-debounce";

const EditElement = ({ elementId }) => {
  const dispatch = useDispatch();
  const element = useSelector((state) => state.data.masterData[elementId]);

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
    defaultValues: {
      title: element.elementName,
      startTime: element.period[0],
      length: element.period[1] - element.period[0],
    },
  });
  const tracks = useSelector((state) => state.data.tracks);
  const tracksArray = Object.keys(tracks).map((track) => {
    return { value: track, label: tracks[track].name };
  });

  const [show, setShow] = useState(true);
  const { startTime, length } = watch();

  const debouncedStartTime = useDebounce(startTime, 700);
  const debouncedLength = useDebounce(length, 700);

  const clearElementInEdit = () => {
    dispatch(setElementInEdit({ elementId: null }));
  };

  const handleRejectModal = () => {
    setShow(false);
    clearElementInEdit();
  };
  const handleConfirmModal = (data) => {
    dispatch(
      updateElementDetails({
        elementId,
        elemPeriodStart: parseInt(data.startTime),
        elemPeriodEnd: parseInt(data.startTime) + parseInt(data.length),
        elementName: data.title,
      })
    );
    setShow(false);
    clearElementInEdit();
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
            isDisabled={true}
            name="track"
            control={control}
            label="Select track"
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={tracksArray}
            required={"Track required"}
            defaultValue={{
              value: element.trackId,
              label: tracks[element.trackId].name,
            }}
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

export default EditElement;
