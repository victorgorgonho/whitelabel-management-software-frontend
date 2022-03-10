import { toast } from 'react-toastify';

export const phoneValidator = () => {
  let phone = (document.getElementById('phone') as HTMLInputElement).value;
  const phoneValid = /^(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))$/;

  if (phoneValid.test(phone) === false) {
    phone = phone.replace(/\D/g, ''); // Remove tudo o que não é dígito

    if (phone.length === 11) {
      toast.success('Telefone válido!', {
        autoClose: 2000,
      });
    } else {
      toast.error('Telefone inválido', {
        autoClose: 2000,
      });
    }
  }
};

export const removeSpecialChars = (specialChar: string) => {
  let newString = specialChar;
  newString = newString.replace(/[|&;$%@"<>()+,/]/g, '');
  newString = newString.replace(/_+/, '_');
  newString = newString.replace(/\s/g, '');
  newString = newString.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  newString = newString.toLowerCase();
  return newString;
};

export const formatDate = (date: string) => {
  try {
    const formattedDate = date.split('-');
    // const formattedHour = formattedDate[2].substring(3).split(':');
    const dia = formattedDate[2].substring(0, 2);
    const mes = formattedDate[1];
    const ano = formattedDate[0];
    // const hora = formattedHour[0];
    // const minutos = formattedHour[1];
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return '00/00/0000';
  }
  // return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
};

export const currencyMask = (value: string) => {
  let v = value.replace(/\D/g, '');
  v = `${(+v / 100).toFixed(2)}`;
  v = v.replace('.', ',');
  v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
  v = v.replace(/(\d)(\d{3}),/g, '$1.$2,');
  return v;
};
export const currencyConvert = (value: string) => {
  if (value === '') {
    return '';
  }
  let v = value.replace(/\D/g, '');
  v = v.replace('.', ',');
  v = v.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
  v = v.replace(/(\d)(\d{3}),/g, '$1.$2,');
  v = `${(+v / 100).toFixed(3)}`;
  return v;
};

export const addZeroes = (num: string) => {
  const dec = num.split('.')[1];
  const len = dec && dec.length > 2 ? dec.length : 2;
  return Number(num).toFixed(len);
};
