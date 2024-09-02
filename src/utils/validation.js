import { toast } from 'react-toastify';
export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isEmail = email => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const isLength = password => {
    if(password.length < 6) return true
    return false
}

export const isMatch = (password, cf_password) => {
    return (password === cf_password) ? true : false
}
export const isMobile = mobile =>{
    // eslint-disable-next-line
    const re = /^([+]\d{2})?\d{10}$/;
    return re.test(mobile);
}
// fileHandlers.js


export const handleFileChange = (event, setFile, setFileName, setTextareaValue) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    setFile(file);
    setFileName(file.name);
    setTextareaValue('');
  }
};

export const handleRemoveFile = (setFile, setFileName, fileInputRef) => {
  setFile(null);
  setFileName('');
  fileInputRef.current.value = '';
};

export const prepareDataToSend = (file, textareaValue, setIsLoading, stopTimer) => {
  if (file) {
    const formData = new FormData();
    formData.append('emails', file);
    return formData;
  } else if (textareaValue) {
    return { email: textareaValue };
  } else {
    toast.error('Empty Input');
    setIsLoading(false);
    stopTimer();
    return null;
  }
};