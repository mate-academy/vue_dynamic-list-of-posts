<template>
  <div className="field" data-cy="BodyField">
    <label className="label" htmlFor="{`comment-${name}`}"> Write Post Body </label>
    <div className="control">
      <textarea
        id="{`comment-${name}`}"
        name="name"
        placeholder="{placeholder}"
        className="textarea is-danger"
      ></textarea>
    </div>

    <p className="help is-danger" data-cy="ErrorMessage">error text</p>
  </div>
</template>
