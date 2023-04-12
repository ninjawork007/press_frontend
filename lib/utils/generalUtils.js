export const downloadURI = (uri, name) => {
  try {
    var link = document.createElement("a");
    link.download = name;
    link.href = `${uri}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.log(e);
  }
};
