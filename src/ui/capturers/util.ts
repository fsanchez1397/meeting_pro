export const handleSelect = (event, cb: (value: string) => void) => {
  if (event.target.value !== false) {
    cb(event.target.value);
  } else {
    console.error("No value selected");
  }
};
