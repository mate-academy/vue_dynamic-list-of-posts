import { useState, useEffect, FC, useCallback } from "react";

import { addPostComment, getPostComments, removePostComment } from "../../api";

import { InputField } from "../../components";
import { TextAreaField } from "../../shared/TextAreaField";
import { createInitErrors } from "../../utils/createInitErrors";
import { Loader } from "../../shared/Loader";

interface Props {
  post: Posts.Data;
  onDeletePost: () => void;
  onEditPost: () => void;
}

const initErrors = createInitErrors(["name", "email", "body"]);

export const PostPreview: FC<Props> = ({ post, onDeletePost, onEditPost }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [comments, setComments] = useState<Posts.Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  const [fields, setFields] = useState({
    name: "",
    email: "",
    body: "",
  });

  const [errors, setErrors] = useState(initErrors);

  useEffect(() => {
    (async () => {
      setLoadingComments(true);

      const comments = await getPostComments(post.id);

      comments && setComments(comments);

      setLoadingComments(false);
    })();
  }, [post.id]);

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

  const handleToggleOpenForm = useCallback(
    (value: boolean) => () => setIsFormOpen(value),
    []
  );

  const handleCreateComment = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const errorsObj = {
        ...Object.keys(fields).reduce(
          (acc, key) => ({
            ...acc,
            [key]:
              key === "email"
                ? fields[key].length >= 3 && fields[key].includes("@")
                : !fields[key as keyof typeof fields].trim(),
          }),
          {}
        ),
      };

      if (Object.values(errorsObj).some(Boolean)) {
        setErrors(errorsObj);

        return;
      }

      try {
        const newComment = await addPostComment({ ...fields, postId: post.id });

        newComment && setComments((prev) => [...prev, newComment]);

        handleToggleOpenForm(false)();
      } catch {
        console.log("can`t add comment");
      }
    },
    [fields, post.id, handleToggleOpenForm]
  );

  const handleDeleteComment = (commentId: number) => async () => {
    try {
      await removePostComment(commentId);

      setComments((prev) => prev.filter((el) => el.id !== commentId));
    } catch {
      console.log("Can't delete comment");
    }
  };

  return (
    <>
      <div className="block">
        <div className="is-flex is-justify-content-space-between is-align-items-center">
          <h2>
            #{post.id}: {post.title}
          </h2>
          <div className="is-flex">
            <span
              className="icon is-small is-right is-clickable"
              onClick={onEditPost}
            >
              <i className="fas fa-pen-to-square"></i>
            </span>
            <span
              className="icon is-small is-right has-text-danger is-clickable ml-3"
              onClick={onDeletePost}
            >
              <i className="fas fa-trash"></i>
            </span>
          </div>
        </div>
        <p data-cy="PostBody">{post.body}</p>
      </div>

      <div className="block">
        {loadingComments && (
          <div className="is-flex is-justify-content-center is-align-items-center mt-2">
            <Loader />
          </div>
        )}

        {!loadingComments && !comments.length && (
          <div className="block">
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          </div>
        )}

        {!loadingComments &&
          !!comments.length &&
          !isFormOpen &&
          comments.map((el) => (
            <article className="message is-small" data-cy="Comment">
              <div className="message-header">
                <a href={`mailto:${el.email}`} data-cy="CommentAuthor">
                  {el.name}
                </a>
                <button
                  data-cy="CommentDelete"
                  type="button"
                  className="delete is-small"
                  aria-label="delete"
                  onClick={handleDeleteComment(el.id)}
                >
                  delete button
                </button>
              </div>
              <div className="message-body" data-cy="CommentBody">
                {el.body}
              </div>
            </article>
          ))}

        {!loadingComments && !isFormOpen && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={handleToggleOpenForm(true)}
          >
            Write a comment
          </button>
        )}

        {!loadingComments && isFormOpen && (
          <form onSubmit={handleCreateComment}>
            <InputField
              title="Author Name"
              onChange={handleChangeInputValue}
              error={errors.name}
              value={fields.name}
              leftIcon="fa-user"
              errorText="Name is required"
              name="name"
              placeholder="Name Surname"
            />

            <InputField
              title="Author Email"
              onChange={handleChangeInputValue}
              error={errors.email}
              value={fields.email}
              leftIcon="fa-envelope"
              errorText="Email is required"
              name="email"
              placeholder="Your Email"
            />

            <TextAreaField
              onChange={handleChangeInputValue}
              title="Write comment"
              name="body"
              error={errors.body}
              value={fields.body}
              placeholder="Comment"
              errorText="Comment is required"
            />

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-link">
                  Add Comment
                </button>
              </div>
              <div className="control">
                <button
                  type="reset"
                  className="button is-link is-light"
                  onClick={handleToggleOpenForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};
