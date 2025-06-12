const generateResponse = (success, data, message, error = null, validationErrors = null) => {
  return {
    success,
    data,
    message,
    ...(error && { error }),
    ...(validationErrors && { validationErrors })
  };
};

export default generateResponse;