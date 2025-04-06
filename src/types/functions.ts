export type SetAddPostErrors = (sendError?: boolean, titleError?: boolean, bodyError?: boolean) => void;
export type SetEditPostErrors = (sendError?: boolean, titleError?: boolean, bodyError?: boolean) => void;
export type SetDeletePostError = (error?: boolean) => void;
export type SetAddCommentErrors = (sendError?: boolean, nameError?: boolean, emailError?: boolean, bodyError?: boolean) => void;
