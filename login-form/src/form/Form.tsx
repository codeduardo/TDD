import {
  Button,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import { FocusEvent, FormEvent, useState } from "react";
import { createProduct } from "./services/useForm";
import { CREATED_STATUS, SERVER_ERROR_STATUS } from "./services/httpStatus";

export const Form = () => {
  const [errors, setErrors] = useState({ name: "", size: "", type: "" });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const validateField = (key: string, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [value]: !key ? `${value} is required` : "",
    }));
  };
  const validateForm = (name: string, size: string, type: string) => {
    validateField(name, "name");
    validateField(size, "size");
    validateField(type, "type");
    if (!name || !size || !type) return;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsDisabled((prev) => !prev);
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(e.currentTarget);
    const name = data.get("name") as string;
    const size = data.get("size") as string;
    const type = data.get("type") as string;
    validateForm(name, size, type);

    await createProduct(name, size, type).then((res) => {
      console.log(res.status);
      if (res.status === CREATED_STATUS) {
        form.reset();
        setShowMessage(true);
      }
      if (res.status === SERVER_ERROR_STATUS)
        setMessage("unexpected error please try again");
    });

    setTimeout(() => {
      setIsDisabled((prev) => !prev);
    }, 100);
  };
  const handleBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    const { name, value } = e.target;
    validateField(value, name);
  };
  return (
    <>
      <Typography variant="h2">Store Product</Typography>
      {showMessage && <span>Product Stored</span>}
      {message && <span>{message}</span>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          helperText={errors.name}
          onBlur={(e) => handleBlur(e)}
          inputProps={{
            name: "name",
          }}
        />
        <TextField
          label="Size"
          helperText={errors.size}
          onBlur={(e) => handleBlur(e)}
          inputProps={{
            name: "size",
          }}
        />
        <InputLabel htmlFor="type">Type</InputLabel>
        <NativeSelect
          inputProps={{
            role: "listbox",
            name: "type",
            id: "type",
          }}
          defaultValue={""}
        >
          <option value="" defaultChecked></option>
          <option value={"electronic"}>Electronic</option>
          <option value={"furniture"}>Furniture</option>
          <option value={"clothing"}>Clothing</option>
        </NativeSelect>
        {errors.type.length && <span>{errors.type}</span>}
        <Button type="submit" disabled={isDisabled}>
          Submit
        </Button>
      </form>
    </>
  );
};
