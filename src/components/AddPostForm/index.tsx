import { useState, FC, useCallback } from "react";

import { InputField } from "components";
import { TextAreaField } from "shared/TextAreaField";
import { createInitErrors } from "utils/createInitErrors";

interface Props {
  onCancel: () => void;
  onSubmit: (post: Posts.New) => void;
  isEditing?: boolean;
  initFields?: Posts.New;
}

const initErrors = createInitErrors(["title", "body"]);

export const AddPostForm: FC<Props> = ({
  onCancel,
  onSubmit,
  initFields,
  isEditing = false,
}) => {
  const [fields, setFields] = useState(
    initFields || {
      title: "",
      body: "",
    }
  );

  const [errors, setErrors] = useState(initErrors);

  const handleChangeInputValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));

      setErrors(initErrors);
    },
    []
  );

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errorsObj = {
      ...Object.keys(fields).reduce(
        (acc, key) => ({
          ...acc,
          [key]: !fields[key as keyof typeof fields].trim(),
        }),
        {}
      ),
    };

    if (Object.values(errorsObj).some(Boolean)) {
      setErrors(errorsObj);

      return;
    }

    onSubmit(fields);
  };

  return (
    <div className="content">
      <h2>{isEditing ? "Post editing" : "Create new post"}</h2>

      <form onSubmit={onSubmitForm}>
        <InputField
          title="Title"
          onChange={handleChangeInputValue}
          error={errors.title}
          value={fields.title}
          leftIcon="fa-heading"
          errorText="Title is required"
          name="title"
          placeholder="Post title"
        />

        <TextAreaField
          onChange={handleChangeInputValue}
          title="Write Post Body"
          name="body"
          error={errors.body}
          value={fields.body}
          placeholder="Post body"
          errorText="Body is required"
        />

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link">
              {isEditing ? "Save" : "Create"}
            </button>
          </div>
          <div className="control">
            <button
              type="reset"
              className="button is-link is-light"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
