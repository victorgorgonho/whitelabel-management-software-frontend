/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/**
 * Action types
 * @UPDATE_USER update user infos
 * @REMOVE_USER remove user infos
 */
export enum UserTypes {
  UPDATE_USER = '@constructionCompany/HANDLE_USER',
  REMOVE_USER = '@constructionCompany/REMOVE_USER',
}

/**
 * Data types
 * @token : token of user
 * @name : name of user
 */

export interface User {
  id?: string;
  name: string;
  email: string;
  user_type: string;
  phone?: string;
  birthDate?: string;
  registration?: string;
  subjects?: string[];
  parent_name?: string;
  parent_cpf?: string;
  parent_whatsapp?: string;
  address_zipcode?: string;
  address_state?: string;
  address_city?: string;
  address_neighborhood?: string;
  address_street?: string;
  address_houseNumber?: string;
  address_complement?: string;
  paymentDay?: string;
  recurrence?: string[];
  isActive?: boolean;
  isCompliant?: boolean;
  createdAt?: string;
  updatedAt?: string;
  gender?: string;
  parent_gender?: string;
  password?: string;
  note?: string;
  monthly_cost?: number | string;
  startDatePayment?: string;
}

/**
 * State type
 * @data : the constructionCompany
 */
export interface UserState {
  user: User;
}
