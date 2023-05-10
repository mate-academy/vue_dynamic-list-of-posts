import { FC } from "react";
import cn from "classnames";
import { Loader } from "shared/Loader";

interface Props {
  onOpenClosePost: (post: number) => () => void;
  openPostId: number | null;

  onOpenNewPostForm: (value: boolean) => () => void;
  isOpenNewPostForm: boolean;

  posts: Posts.Data[];
  isLoading: boolean;
}

export const PostsList: FC<Props> = ({
  onOpenClosePost,
  openPostId,
  isOpenNewPostForm,
  onOpenNewPostForm,
  posts,
  isLoading,
}) => (
  <div className="tile is-parent">
    <div className="tile is-child box is-success">
      <div className="block">
        <div className="block is-flex is-justify-content-space-between">
          <p className="title">Posts</p>
          <button
            type="button"
            className={cn("button is-link", {
              "is-light": isOpenNewPostForm,
            })}
            onClick={onOpenNewPostForm(true)}
          >
            Add New Post
          </button>
        </div>
        {isLoading ? (
          <div className="is-flex is-justify-content-center is-align-items-center mt-2">
            <Loader />
          </div>
        ) : (
          <table className="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
              <tr className="has-background-link-light">
                <th>ID</th>
                <th>Title</th>
                <th className="has-text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((el) => (
                <tr key={el.id}>
                  <td>{el.id}</td>
                  <td>{el.title}</td>
                  <td className="has-text-right is-vcentered">
                    <button
                      type="button"
                      className={cn("button is-link", {
                        "is-light": openPostId !== el.id,
                      })}
                      onClick={onOpenClosePost(el.id)}
                    >
                      {openPostId === el.id ? "Close" : "Open"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
