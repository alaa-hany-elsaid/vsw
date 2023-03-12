import React from 'react';


export const useFilePicker = ({
  minSize,
  maxSize,
}= {}) => {
  const inputRef = React.useRef(null);
  const [files, setFiles] = React.useState([]);
  const [errors, setErrors] = React.useState([]);

  const onChange = React.useCallback(
    (evt) => {
      const fileList = evt?.target?.files;

      const newFiles = Array.prototype.slice.call(fileList);

      const newErrors = [];
      newFiles.forEach((file, index) => {
        if (minSize && minSize > file.size)
          newErrors.push({
            index,
            message: 'File smaller than minimum size.',
          });
        else if (maxSize && maxSize < file.size)
          newErrors.push({
            index,
            message: 'File larger than maximum size.',
          });
      });

      setErrors(newErrors);
      setFiles(newFiles);
    },
    [maxSize, minSize]
  );

  const showFilePicker = React.useCallback(() => {
    inputRef?.current?.click();
  }, []);

  return {
    files,
    setFiles,
    errors,
    showFilePicker,
    FileInput(inputProps) {
      return (
        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={onChange}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
        />
      );
    },
  };
};
