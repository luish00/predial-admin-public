import { DEV_MODE } from './contanst';

function downloadCSV(csv: BlobPart, filename = '') {
  const csvFile = new Blob([csv], { type: "text/csv" });
  // Download link
  const downloadLink = document.createElement("a");
  // File name
  downloadLink.download = `${filename}-${Date.now()}`;
  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);
  // Hide download link
  downloadLink.style.display = "none";
  // Add the link to DOM
  document.body.appendChild(downloadLink);
  // Click download link 
  downloadLink.click();
}

export const convertToCSV = (arr: object[], filename = '') => {
  const array = [Object.keys(arr[0])].concat(arr);

  const data = array.map(it => {
    return Object.values(it).toString();
  }).join('\n');

  downloadCSV(data, filename);
};

export const tryLog = async ({ key = '', message = '' }) => {
  if (!DEV_MODE) {
    return;
  }

  console.log(key, message);
};

// This function uses setTimeout but can be combined with await in an async
// function to wait for some time before continuing execution.
export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
