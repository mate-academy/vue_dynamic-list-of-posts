import { FC } from "react";
import cn from "classnames";

interface Props {
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error: boolean;
  value: string;
  errorText: string;
  placeholder: string;
  title: string;
  name: string;
}

export const TextAreaField: FC<Props> = ({
  onChange,
  error,
  errorText,
  name,
  placeholder,
  value,
}) => (
  <div className="field" data-cy="BodyField">
    <label className="label" htmlFor={`comment-${name}`}>
      Write Post Body
    </label>
    <div className="control">
      <textarea
        id={`comment-${name}`}
        name={name}
        placeholder={placeholder}
        className={cn("textarea", { "is-danger": error })}
        value={value}
        onChange={onChange}
      />
    </div>

    {error && (
      <p className="help is-danger" data-cy="ErrorMessage">
        {errorText}
      </p>
    )}
  </div>
);
