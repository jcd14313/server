exports.FormatErrors = (errors) => {
  return errors.array().reduce((newObj, curr) => {
    if (typeof newObj[curr.param] === "undefined") {
      newObj[curr.param] = [];
    }
    newObj[curr.param].push(curr.msg);
    return newObj;
  }, {});
};
