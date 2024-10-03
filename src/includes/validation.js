//https://vee-validate.logaretm.com/v4/api/configuration/

import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  alpha_num,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

import { localize, setLocale } from "@vee-validate/i18n";
import en from '@vee-validate/i18n/dist/locale/en.json';
import ja from "@vee-validate/i18n/dist/locale/ja.json";
import zh_CN from '@vee-validate/i18n/dist/locale/zh_CN.json';

export default {

  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule('tos', required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("passwords_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("alpha_num", alpha_num);

    // defineRule('email', value => {
    //   // Field is empty, should pass
    //   if (!value || !value.length) {
    //     return true;
    //   }
    //   // Check if email
    //   if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(value)) {
    //     return 'This field must be a valid email';
    //   }
    //   return true;
    // });

    //load localize message
    localize({ ja, en });
    //set locale
    setLocale('ja');
    
    configure({
      generateMessage: localize(
        en,
        ja,
        zh_CN,
        {
          //name: 'The {field} is required' , add custom validate message
          //tos: 'You must accept the Terms of Service.',
        }
      ),

      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });

  },
};
