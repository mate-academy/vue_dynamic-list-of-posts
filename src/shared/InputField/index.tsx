import { FC } from "react";
import cn from "classnames";

interface Props {
  name: string;
  title: string;
  error?: boolean;
  errorText?: string;
  leftIcon: string;
  value: string;
  onChange: (
    val: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
}

export const InputField: FC<Props> = ({
  leftIcon,
  title,
  error,
  errorText,
  value,
  onChange,
  name,
  placeholder,
}) => (
  <div className="field" data-cy="NameField">
    <label className="label" htmlFor={`comment-author-name-${name}`}>
      {title}
    </label>
    <div className="control has-icons-left has-icons-right">
      <input
        type="text"
        name={name}
        id={`comment-author-name-${name}`}
        placeholder={placeholder}
        className={cn("input", { "is-danger": error })}
        value={value}
        onChange={onChange}
      />
      <span className="icon is-small is-left">
        <i className={cn("fas fa-user", leftIcon)}></i>
      </span>

      {error && (
        <span
          className="icon is-small is-right has-text-danger"
          data-cy="ErrorIcon"
        >
          <i className="fas fa-exclamation-triangle"></i>
        </span>
      )}
    </div>
    {error && errorText && (
      <p className="help is-danger" data-cy="ErrorMessage">
        {errorText}
      </p>
    )}
  </div>
);
